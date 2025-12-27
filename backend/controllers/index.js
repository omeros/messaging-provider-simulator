const MessageController = require("./messageController");
const MessageService = require("../services/messageService");
const FakeProvider = require("../providers/fakeProvider");

const messagesById = new Map(); // storage shared
const provider = new FakeProvider({ failureRate: 0.8, minDelayMs: 3000, maxDelayMs: 1000 });
const messageService = new MessageService({ provider, messagesById, maxAttempts: 3, baseDelayMs: 600 });

const messageController = new MessageController({ messageService });

//  the controller and the service  will use the same storage.
messageController.messagesById = messagesById;

module.exports = { messageController };
