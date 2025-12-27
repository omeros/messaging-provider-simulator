const crypto = require("crypto");




class MessageController {

  constructor({ messageService } = {}) {
    this.messageService = messageService;
    this.messagesById = new Map();            // messageId -> message
    this.idemToMessageId = new Map();        // idempotencyKey -> messageId  
  }

  sendMessage(req,res){
    console.log('sendMessage function');
    
    const idempotencyKey = req.header("Idempotency-Key"); // or req.body.requestId
    const { to, content } = req.body;
    if (!to || !content) {
        return res.status(400).json({ error: "`to` and `content` are required" });
    }
    if (idempotencyKey && this.idemToMessageId.has(idempotencyKey)) {
        const messageId = this.idemToMessageId.get(idempotencyKey);
        return res.json(this.messagesById.get(messageId));
    }
    const message = {
        id: crypto.randomUUID(),
        to,
        content,
        status: "pending",
        createdAt: new Date().toISOString(),
    };
    this.messagesById.set(message.id, message);
    if (idempotencyKey) this.idemToMessageId.set(idempotencyKey, message.id);
    console.log(`[message] ${message.id} status=${message.status}`);
    res.status(202).json(message);
  }

  getMessages(req, res) {
    return res.json(Array.from(this.messagesById.values()));
  }

}

module.exports = new MessageController();
//    const message  = { id, to, content, status, createdAt } 
