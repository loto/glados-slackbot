'use strict';
require('dotenv').config();
const baseLogger = require('pino')();
const fastify = require('fastify')({ logger: true });
fastify.register(require('fastify-formbody'));
const { WebClient } = require('@slack/client');
const glados = require('./lib/glados/adapter');
const webApiClient = new WebClient(process.env.SLACK_OAUTH_TOKEN);

fastify.post('/slack-event-raised', async (request, reply) => {
    let payload = request.body;
    // Slack events subscription endpoint verification, https://api.slack.com/events/url_verification
    if (payload.type === 'url_verification') {
        reply.type('text/plain').code(200).send(payload.challenge);
        return;
    }

    let event = payload.event;
    // Always respond under 3s or slack will consider the call as failed and will retry
    // https://api.slack.com/events-api, see 'Responding to Events' section
    reply.type('text/plain').code(204).send();
    if (event.subtype === 'bot_message') return;

    let response = { channel: event.channel };
    try {
        let uuid = `${event.team}-${event.channel}-${event.user}`;
        response['text'] = await glados.sendMessage(uuid, event.text);
    } catch (error) {
        response['attachments'] = new Array({ 
            'title' : `I'm sorry but an error occurred` ,
            'text' : error.message,
            'color' : 'danger'

        });
    }

    webApiClient.chat.postMessage(response)
        .then((res) => {
            baseLogger.info('Message sent: ', res.ts);
        })
        .catch(baseLogger.error);
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
    let uuid = `${request.body.team_id}-${request.body.channel_id}-${request.body.user_id}`;
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
