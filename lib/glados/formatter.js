async function formatResponse(channel, responseMessage) {
    let response = { channel: channel };

    if (typeof responseMessage === 'string' || responseMessage instanceof String) response['text'] = responseMessage;
    if (responseMessage.text) response['text'] = responseMessage.text;

    return response;
}

async function formatError(channel, error) {
    let response = { channel: channel };

    response['attachments'] = new Array({
        'title': 'An error occurred',
        'text': error.message,
        'color': 'danger'
    });

    return response;
}

module.exports = {
    formatResponse,
    formatError
}
