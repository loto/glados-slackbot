'use strict';
require('dotenv').config();
const baseLogger = require('pino')({ level: process.env.LOG_LEVEL });
const fastify = require('fastify')({ logger: { level: process.env.LOG_LEVEL } });
fastify.register(require('fastify-formbody'));
const { WebClient } = require('@slack/client');
const glados = require('./lib/glados/adapter');
const formatter = require('./lib/glados/formatter');
const webApiClient = new WebClient(process.env.SLACK_BOT_TOKEN);

fastify.post('/slack-event-raised', async (request, reply) => {
    let payload = request.body;
    // Slack events subscription endpoint verification, https://api.slack.com/events/url_verification
    if (payload.type === 'url_verification') {
        reply.type('text/plain').code(200).send(payload.challenge);
        return;
    }

    let event = payload.event;
    // Always respond under 3s or slack will consider the call failed and follow its retry policy
    // https://api.slack.com/events-api, see 'Responding to Events' section
    reply.type('text/plain').code(204).send();
    if (event.subtype === 'bot_message') return;

    let response;
    try {
        let uuid = `${event.channel}-${event.user}`;
        let message = await glados.sendMessage(uuid, event.text);
        response = await formatter.formatResponse(event, message);
    } catch (error) {
        response = await formatter.formatError(event, error);
    }

    webApiClient.chat.postMessage(response)
        .then((res) => {
            baseLogger.info('Message sent: ', res.ts);
        })
        .catch((error) => {
            baseLogger.error(error.message);
        });
});

fastify.post('/list-agents', async (_request, reply) => {
    reply.type('application/json').code(200);
    // TODO: reply immediately and use callback URL
    // TODO: catch errors and return something
    let agents = await glados.listAgents();
    return {
        'text': `Available agents:`,
        'attachments': agents.map((element) => {
            return { 'text': element, 'color': '#7CD197' }
        })
    };
});

fastify.post('/select-agent', async (request, reply) => {
    reply.type('application/json').code(200);
    let uuid = `${request.body.channel_id}-${request.body.user_id}`;
    // TODO: reply immediately and use callback URL
    // TODO: catch errors and return something
    let agentName = await glados.selectAgent(uuid, request.body.text);
    return {
        'text': `You selected the following agent:`,
        'attachments': [{ 'text': agentName, 'color': '#7CD197' }]
    };
});

fastify.listen(process.env.PORT, (err, _address) => {
    if (err) throw err;
});
