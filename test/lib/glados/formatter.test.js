const assert = require('assert');
const subject = require('../../../lib/glados/formatter');

describe('glados', () => {
    describe('formatter', () => {
        describe('#formatError()', () => {
            it('returns a valid response message', async () => {
                let event = { channel: 'abc123' };
                let error = { message: 'Test error' };

                let result = await subject.formatError(event, error);

                assert.deepEqual(result, {
                    'channel': event.channel,
                    'attachments': [
                        {
                            'title': 'An error occurred',
                            'text': error.message,
                            'color': 'danger'
                        }
                    ]
                });
            });
        });

        describe('#formatResponse()', () => {
            describe('when the response message is a string', () => {
                it('returns a message without attachment', async () => {
                    let event = { channel: 'abc123' };
                    let responseMessage = 'A message';

                    let result = await subject.formatResponse(event, responseMessage);

                    assert.deepEqual(result, {
                        'channel': event.channel,
                        'as_user': false,
                        'text': responseMessage
                    });
                });
            });

            describe('when the response message is an object', () => {
                describe('and has no attachment', () => {
                    it('returns a message without attachment', async () => {
                        let event = { channel: 'abc123' };
                        let responseMessage = { text: 'A message' };

                        let result = await subject.formatResponse(event, responseMessage);

                        assert.deepEqual(result, {
                            'channel': event.channel,
                            'as_user': false,
                            'text': responseMessage.text
                        });
                    });
                });

                describe('and has an empty attachments array', () => {
                    it('returns a message without attachment', async () => {
                        let event = { channel: 'abc123' };
                        let responseMessage = { text: 'A message', attachments: [] };

                        let result = await subject.formatResponse(event, responseMessage);

                        assert.deepEqual(result, {
                            'channel': event.channel,
                            'as_user': false,
                            'text': responseMessage.text
                        });
                    });
                });

                describe('and has attachments', () => {
                    it('returns a message with the attachments', async () => {
                        let event = { channel: 'abc123' };
                        let responseMessage = {
                            text: 'A message',
                            attachments: [
                                {
                                    elements: [
                                        {
                                            key: 'value A',
                                            text: 'The title'
                                        },
                                        {
                                            key: 'value B',
                                            text: 'The description'
                                        }
                                    ]

                                }
                            ]
                        };

                        let result = await subject.formatResponse(event, responseMessage);

                        assert.deepEqual(result, {
                            'channel': event.channel,
                            'as_user': false,
                            'text': responseMessage.text,
                            'attachments': [
                                {
                                    'title': 'The title',
                                    'text': 'The description',
                                    'color': 'good'
                                }
                            ]
                        });
                    });

                    describe('when it contains facts', () => {
                        it('returns a message with the attachments and the facts', async () => {
                            let event = { channel: 'abc123' };
                            let responseMessage = {
                                text: 'A message',
                                attachments: [
                                    {
                                        elements: [
                                            {
                                                key: 'value A',
                                                text: 'The title'
                                            },
                                            {
                                                key: 'value B',
                                                text: 'The description'
                                            },
                                            {
                                                key: 'value C',
                                                facts: [
                                                    {
                                                        title: 'Opened at:',
                                                        value: '2018-06-22 21:56:37'
                                                      },
                                                      {
                                                        title: 'Priority:',
                                                        value: '2'
                                                      }
                                                ]
                                            }
                                        ]

                                    }
                                ]
                            };

                            let result = await subject.formatResponse(event, responseMessage);

                            assert.deepEqual(result, {
                                'channel': event.channel,
                                'as_user': false,
                                'text': responseMessage.text,
                                'attachments': [
                                    {
                                        'title': 'The title',
                                        'text': 'The description',
                                        'color': 'good',
                                        'fields': [
                                            {
                                                'short': true,
                                                'title': 'Opened at:',
                                                'value': '2018-06-22 21:56:37'
                                            },
                                            {
                                                'short': true,
                                                'title': 'Priority:',
                                                'value': '2'
                                            }
                                        ]
                                    }
                                ]
                            });
                        });
                    });
                });
            });
        });
    });
});
