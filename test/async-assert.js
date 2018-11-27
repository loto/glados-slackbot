const assert = require('assert');

async function throws(fn, regExp = undefined) {
    let f = () => { };
    try {
        await fn();
    } catch (e) {
        f = () => { throw e };
    } finally {
        assert.throws(f, regExp);
    }
}

async function doesNotThrow(fn, error = undefined, regExp = undefined) {
    let f = () => { };
    try {
        await fn();
    } catch (e) {
        f = () => { throw e };
    } finally {
        assert.doesNotThrow(f, error, regExp);
    }
}

module.exports = {
    throws,
    doesNotThrow
}
