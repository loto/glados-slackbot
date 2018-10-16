'use strict';
require('dotenv').config();
const fastify = require('fastify')({ logger: true });
fastify.register(require('fastify-formbody'));
const { RTMClient } = require('@slack/client');
const glados = require('./glados/adapter');

const rtm = new RTMClient(process.env.SLACK_BOT_TOKEN);
rtm.start();

rtm.on('message', async (event) => {
    if ((event.subtype && event.subtype === 'bot_message') ||
        (!event.subtype && event.subtype === rtm.activeUserId)) {
        return;
    }

    let uuid = `${event.team}-${event.channel}-${event.user}`;
    // TODO: catch errors and return something
    let response = await glados.sendMessage(uuid, event.text);

    rtm.sendMessage(response, event.channel)
        .then((res) => {
            console.log('Message sent: ', res.ts);
        })
        .catch(console.error);
});

fastify.post('/list-agents', async (request, reply) => {
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

fastify.listen(process.env.PORT, (err, address) => {
    if (err) throw err
    fastify.log.info(`server listening on ${address}`)
});
