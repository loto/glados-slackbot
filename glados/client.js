const axios = require('axios');

exports.conversationStart = async (uuid, remainingAttempts = 3) => {
    let response;
    try {
        response = await axios.post(`${process.env.GLADOS_BOT_URL}/conversation/start`, {}, { timeout: 2000 });
    }
    catch (error) {
        if (remainingAttempts === 0) throw error;
        switch (error.code) {
            // Timeout error
            case 'ECONNABORTED':
                console.log('Timeout error');
                break;
            default:
                console.log(`Unexpected ${error.code} raised`);
                throw error;
        };

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
        switch (error.code) {
            // Timeout error
            case 'ECONNABORTED':
                console.log('Timeout error');
                break;
            default:
                console.log(`Unexpected ${error.code} raised`);
                throw error;
        };

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
        switch (error.code) {
            // Timeout error
            case 'ECONNABORTED':
                console.log('Timeout error');
                break;
            default:
                console.log(`Unexpected ${error.name} raised: ${error.code} -> ${error.message}`);
                throw error;
        };

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
        switch (error.code) {
            // Timeout error
            case 'ECONNABORTED':
                console.log('Timeout error');
                break;
            default:
                console.log(`Unexpected ${error.name} raised: ${error.code} -> ${error.message}`);
                throw error;
        };

        return await agentSelect(token, name, remainingAttempts - 1);
    }

    return response.data.agent;
}
