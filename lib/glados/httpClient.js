const restClient = require('../rest/client');

async function conversationStart(uuid) {
    let response = await restClient.create().post(`${process.env.GLADOS_BOT_URL}/conversation/start`);
    return response.data.token;
}

async function conversationSay(token, message) {
    let response = await restClient.create().post(`${process.env.GLADOS_BOT_URL}/conversation/say`, { 'token': token, 'message': message });
    return response.data.reply;
}

async function agentsList() {
    let response = await restClient.create().get(`${process.env.GLADOS_BOT_URL}/agents/list`);
    return response.data.agents;
}

async function agentSelect(token, name) {
    let response = await restClient.create().post(`${process.env.GLADOS_BOT_URL}/agent/select`, { 'token': token, 'name': name });
    return response.data.agent;
}

module.exports = {
    conversationStart,
    conversationSay,
    agentsList,
    agentSelect
}
