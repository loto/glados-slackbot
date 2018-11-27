const strategy = require('../strategy');
const httpClient = require('./httpClient');

async function conversationStart(uuid) {
    return await strategy.withRetries(httpClient.conversationStart, arguments, 'Glados: conversation start');
}

async function conversationSay(token, message) {
    return await strategy.withRetries(httpClient.conversationSay, arguments, 'Glados: conversation say');
}

async function agentsList() {
    return await strategy.withRetries(httpClient.agentsList, arguments, 'Glados: agents list');
}

async function agentSelect(token, name) {
    return await strategy.withRetries(httpClient.agentSelect, arguments, 'Glados: agent select');
}

module.exports = {
    conversationStart,
    conversationSay,
    agentsList,
    agentSelect
}
