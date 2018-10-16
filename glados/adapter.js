const client = require('./client');
const cache = {};

exports.sendMessage = async function (uuid, message) {
    let conversationToken = await loadConversationToken(uuid);
    return await client.conversationSay(conversationToken, message);
}

exports.listAgents = async () => {
    return await client.agentsList();
}

exports.selectAgent = async (uuid, name) => {
    let conversationToken = await loadConversationToken(uuid);
    return await client.agentSelect(conversationToken, name);
}

startConversation = async (uuid) => {
    let token = await client.conversationStart(uuid);
    cache[uuid] = token;
    return token;
}

loadConversationToken = async (uuid) => {
    let conversationToken = cache[uuid];
    if (!conversationToken) conversationToken = await startConversation(uuid);
    return conversationToken;
}
