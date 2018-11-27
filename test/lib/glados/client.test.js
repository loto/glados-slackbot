const asyncAssert = require('../../async-assert');
const assert = require('assert');
const proxyquire = require('proxyquire').noPreserveCache();
let strategyStub = {};
const subject = proxyquire('../../../lib/glados/client', { '../strategy': strategyStub });

describe('glados', () => {
    describe('client', () => {
        describe('#conversationStart()', () => {
            describe('when the httpClient call fails', () => {
                it('throws an error', async () => {
                    let uuid = '123abc';

                    strategyStub.withRetries = () => { throw new Error('Unexpected error') };

                    await asyncAssert.throws(async () => await subject.conversationStart(uuid), /Unexpected error/);
                });
            });

            describe('when the httpClient call succeeds', () => {
                it('returns the httpClient call result', async () => {
                    let uuid = '123abc';
                    let response = 'A response';

                    strategyStub.withRetries = () => { return response; };

                    let result;
                    await asyncAssert.doesNotThrow(async () => result = await subject.conversationStart(uuid));
                    assert.equal(result, response);
                });
            });
        });

        describe('#conversationSay()', () => {
            describe('when the httpClient call fails', () => {
                it('throws an error', async () => {
                    let token = '123abc';
                    let message = 'A message';

                    strategyStub.withRetries = () => { throw new Error('Unexpected error') };

                    await asyncAssert.throws(async () => await subject.conversationSay(token, message), /Unexpected error/);
                });
            });

            describe('when the httpClient call succeeds', () => {
                it('returns the httpClient call result', async () => {
                    let token = '123abc';
                    let message = 'A message';
                    let response = 'A response';

                    strategyStub.withRetries = () => { return response; };

                    let result;
                    await asyncAssert.doesNotThrow(async () => result = await subject.conversationSay(token, message));
                    assert.equal(result, response);
                });
            });
        });

        describe('#agentsList()', () => {
            describe('when the httpClient call fails', () => {
                it('throws an error', async () => {
                    strategyStub.withRetries = () => { throw new Error('Unexpected error') };

                    await asyncAssert.throws(async () => await subject.agentsList(), /Unexpected error/);
                });
            });

            describe('when the httpClient call succeeds', () => {
                it('returns the httpClient call result', async () => {
                    let response = 'A response';

                    strategyStub.withRetries = () => { return response; };

                    let result;
                    await asyncAssert.doesNotThrow(async () => result = await subject.agentsList());
                    assert.equal(result, response);
                });
            });
        });

        describe('#agentSelect()', () => {
            describe('when the httpClient call fails', () => {
                it('throws an error', async () => {
                    let token = '123abc';
                    let agent = 'Agent name';

                    strategyStub.withRetries = () => { throw new Error('Unexpected error') };

                    await asyncAssert.throws(async () => await subject.agentSelect(token, agent), /Unexpected error/);
                });
            });

            describe('when the httpClient call succeeds', () => {
                it('returns the httpClient call result', async () => {
                    let token = '123abc';
                    let agent = 'Agent name';
                    let response = 'A response';

                    strategyStub.withRetries = () => { return response; };

                    let result;
                    await asyncAssert.doesNotThrow(async () => result = await subject.agentSelect(token, agent));
                    assert.equal(result, response);
                });
            });
        });
    });
});
