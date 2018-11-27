const asyncAssert = require('../../async-assert');
const assert = require('assert');
const proxyquire = require('proxyquire').noPreserveCache();
let restClientStub = {};
const subject = proxyquire('../../../lib/glados/httpClient', { '../rest/client': restClientStub });

describe('glados', () => {
    describe('httpClient', () => {
        describe('#conversationStart()', () => {
            describe('when the HTTP request fails', () => {
                it('throws an error', async () => {
                    let uuid = '123abc';

                    restClientStub.create = () => { throw new Error('HTTP request failed') };

                    await asyncAssert.throws(async () => await subject.conversationStart(uuid), /HTTP request failed/);
                });
            });

            describe('when the HTTP request succeeds', () => {
                it('returns a token', async () => {
                    let uuid = '123abc';
                    let token = '456efg';

                    restClientStub.create = () => {
                        return {
                            post: async (...args) => {
                                return { data: { token: token } }
                            }
                        }
                    };

                    let resultToken;
                    await asyncAssert.doesNotThrow(async () => resultToken = await subject.conversationStart(uuid));
                    assert.equal(resultToken, token);
                });
            });
        });

        describe('#conversationSay()', () => {
            describe('when the HTTP request fails', () => {
                it('throws an error', async () => {
                    let token = '123abc';
                    let message = 'A message';

                    restClientStub.create = () => { throw new Error('HTTP request failed') };

                    await asyncAssert.throws(async () => await subject.conversationSay(token, message), /HTTP request failed/);
                });
            });

            describe('when the HTTP request succeeds', () => {
                it('returns a reply', async () => {
                    let token = '123abc';
                    let message = 'A message';
                    let response = 'A response';

                    restClientStub.create = () => {
                        return {
                            post: async (...args) => {
                                return { data: { reply: response } }
                            }
                        }
                    };

                    let resultResponse;
                    await asyncAssert.doesNotThrow(async () => resultResponse = await subject.conversationSay(token, message));
                    assert.equal(resultResponse, response);
                });
            });
        });

        describe('#agentsList()', () => {
            describe('when the HTTP request fails', () => {
                it('throws an error', async () => {
                    restClientStub.create = () => { throw new Error('HTTP request failed') };

                    await asyncAssert.throws(async () => await subject.agentsList(), /HTTP request failed/);
                });
            });

            describe('when the HTTP request succeeds', () => {
                it('returns a list of agents', async () => {
                    let agents = ['a', 'b', 'c'];

                    restClientStub.create = () => {
                        return {
                            get: async (...args) => {
                                return { data: { agents: agents } }
                            }
                        }
                    };

                    let resultResponse;
                    await asyncAssert.doesNotThrow(async () => resultResponse = await subject.agentsList());
                    assert.equal(resultResponse, agents);
                });
            });
        });

        describe('#agentSelect()', () => {
            describe('when the HTTP request fails', () => {
                it('throws an error', async () => {
                    restClientStub.create = () => { throw new Error('HTTP request failed') };

                    await asyncAssert.throws(async () => await subject.agentSelect(), /HTTP request failed/);
                });
            });

            describe('when the HTTP request succeeds', () => {
                it('returns the agent name', async () => {
                    let token = '123abc';
                    let agent = 'a';

                    restClientStub.create = () => {
                        return {
                            post: async (...args) => {
                                return { data: { agent: agent } }
                            }
                        }
                    };

                    let resultResponse;
                    await asyncAssert.doesNotThrow(async () => resultResponse = await subject.agentSelect(token, agent));
                    assert.equal(resultResponse, agent);
                });
            });
        });
    });
});
