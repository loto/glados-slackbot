const errors = require('./rest/errors');

async function withRetries(fn, args, errorMessage = 'startegy.withRetries()', remainingAttempts = 3) {
    let result;
    try {
        result = await fn.apply(null, args);
    }
    catch (error) {
        if (remainingAttempts === 1) throw new errors.TooManyAttemptsError(error, errorMessage);
        return await withRetries(fn, args, errorMessage, remainingAttempts - 1);
    }

    return result;
}

module.exports = {
    withRetries
}
