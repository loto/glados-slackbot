const axios = require('axios');
const cache = {};

exports.sendMessage = async function (uuid, message) {
    let conversationToken = cache[uuid];
    if (!conversationToken) {
        // TODO: handle request errors
        let response = await axios.post(`${process.env.GLADOS_BOT_URL}/conversation/start`);
        // TODO: handle response errors
        conversationToken = response.data.token
        cache[uuid] = conversationToken;
    }

    // TODO: handle request errors
    let response = await axios.post(`${process.env.GLADOS_BOT_URL}/conversation/say`, { 'token': conversationToken, 'message': message });
    // TODO: handle response errors
    return response.data.reply;
}

exports.listAgents = async () => {
    // TODO: handle request errors
    let response = await axios.get(`${process.env.GLADOS_BOT_URL}/agents/list`);
    // TODO: handle response errors
    return response.data.agents;
}

exports.selectAgent = async (uuid, name) => {
    let conversationToken = cache[uuid];
    if (!conversationToken) {
        // TODO: handle request errors
        let response = await axios.post(`${process.env.GLADOS_BOT_URL}/conversation/start`);
        // TODO: handle response errors
        conversationToken = response.data.token
        cache[uuid] = conversationToken;
    }

    // TODO: handle request errors
    let response = await axios.post(`${process.env.GLADOS_BOT_URL}/agent/select`, { 'token': conversationToken, 'name': name });
    // TODO: handle response errors
    return response.data.agent;
}
