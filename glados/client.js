const baseLogger = require('pino')();
const axios = require('axios');
axios.interceptors.request.use(function (config) {
    const requestLogger = baseLogger.child({ url: config.url, data: config.data });
    requestLogger.info('Request sent');
    return config;
}, function (error) {
    // error.response / error.request
    const requestLogger = baseLogger.child({ url: error.config.url, data: error.config.data });
    requestLogger.error('Unable to send the request');
    throw error;
});

axios.interceptors.response.use(function (response) {
    const requestLogger = baseLogger.child({ url: response.config.url, data: response.data });
    requestLogger.info('Response received');
    return response;
}, function (error) {
    // error.response / error.request
    const requestLogger = baseLogger.child({ url: error.config.url, data: error.config.data });
    requestLogger.error(`Unexpected ${error.name} received | ${error.code} | ${error.message}`);
    throw error;
});

exports.conversationStart = async (uuid, remainingAttempts = 3) => {
    let response;
    try {
        response = await axios.post(`${process.env.GLADOS_BOT_URL}/conversation/start`, {}, { timeout: 2000 });
    }
    catch (error) {
        if (remainingAttempts === 0) throw error;
        return await conversationStart(uuid, remainingAttempts - 1);
    }

    return response.data.token;
}

exports.conversationSay = async (token, message, remainingAttempts = 3) => {
    let response;
    try {
        response = await axios.post(`${process.env.GLADOS_BOT_URL}/conversation/say`, { 'token': token, 'message': message }, { timeout: 2000 });
    }
    catch (error) {
        if (remainingAttempts === 0) throw error;
        return await conversationSay(token, message, remainingAttempts - 1);
    }

    return response.data.reply;
}

exports.agentsList = async (remainingAttempts = 3) => {
    let response;
    try {
        response = await axios.get(`${process.env.GLADOS_BOT_URL}/agents/list`, { timeout: 2000 });
    }
    catch (error) {
        if (remainingAttempts === 0) throw error;
        return await agentsList(remainingAttempts - 1);
    }

    return response.data.agents;
}

exports.agentSelect = async (token, name, remainingAttempts = 3) => {
    let response;
    try {
        response = await axios.post(`${process.env.GLADOS_BOT_URL}/agent/select`, { 'token': token, 'name': name }, { timeout: 2000 });
    }
    catch (error) {
        if (remainingAttempts === 0) throw error;
        return await agentSelect(token, name, remainingAttempts - 1);
    }

    return response.data.agent;
}
