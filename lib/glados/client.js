const restClient = require('../rest/client');
const errors = require('../rest/errors');

async function conversationStart(uuid, remainingAttempts = 3) {
    let response;
    try {
        response = await restClient.create().post(`${process.env.GLADOS_BOT_URL}/conversation/start`);
    }
    catch (error) {
        if (remainingAttempts === 1) throw new errors.TooManyAttemptsError(error, 'Glados: conversation start');
        return await conversationStart(uuid, remainingAttempts - 1);
    }

    return response.data.token;
}

async function conversationSay(token, message, remainingAttempts = 3) {
    let response;
    try {
        response = await restClient.create().post(`${process.env.GLADOS_BOT_URL}/conversation/say`, { 'token': token, 'message': message });
    }
    catch (error) {
        if (remainingAttempts === 1) throw new errors.TooManyAttemptsError(error, 'Glados: conversation say');
        return await conversationSay(token, message, remainingAttempts - 1);
    }

    return response.data.reply;
}

async function agentsList(remainingAttempts = 3) {
    let response;
    try {
        response = await restClient.create().get(`${process.env.GLADOS_BOT_URL}/agents/list`);
    }
    catch (error) {
        if (remainingAttempts === 1) throw new errors.TooManyAttemptsError(error, 'Glados: agents list');
        return await agentsList(remainingAttempts - 1);
    }

    return response.data.agents;
}

async function agentSelect(token, name, remainingAttempts = 3) {
    let response;
    try {
        response = await restClient.create().post(`${process.env.GLADOS_BOT_URL}/agent/select`, { 'token': token, 'name': name });
    }
    catch (error) {
        if (remainingAttempts === 1) throw new errors.TooManyAttemptsError(error, 'Glados: agent select');
        return await agentSelect(token, name, remainingAttempts - 1);
    }

    return response.data.agent;
}

module.exports = {
    conversationStart,
    conversationSay,
    agentsList,
    agentSelect
}
