'use strict';
require('dotenv').config();
const baseLogger = require('pino')();
const fastify = require('fastify')({ logger: true });
fastify.register(require('fastify-formbody'));
const { RTMClient } = require('@slack/client');
const glados = require('./lib/glados/adapter');

const rtm = new RTMClient(process.env.SLACK_BOT_TOKEN);
rtm.start();

rtm.on('message', async (event) => {
    if ((event.subtype && event.subtype === 'bot_message') ||
        (!event.subtype && event.subtype === rtm.activeUserId)) {
        return;
    }

    let response;
    try {
        await rtm.sendTyping(event.channel);
        let uuid = `${event.team}-${event.channel}-${event.user}`;
        response = await glados.sendMessage(uuid, event.text);
    } catch (error) {
        response = `I'm sorry but an error occurred:\n> ${error.code}\n> ${error.message}`;
    }

    rtm.sendMessage(response, event.channel)
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
