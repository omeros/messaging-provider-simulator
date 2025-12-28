const crypto = require("crypto");




class MessageController {

  constructor({ messageService } = {}) {
    this.messageService = messageService;
    this.messagesById = new Map();            // messageId -> message
    this.idemToMessageId = new Map();        // idempotencyKey -> messageId  
  }

  sendMessage(req,res){
    console.log('sendMessage working!');
    
    const idempotencyKey = req.header("Idempotency-Key")?.trim() || null;
    const rawTo = req.body?.to;
    const rawContent = req.body?.content;
    const to = typeof rawTo === "string" ? rawTo.trim() : "";
    const content = typeof rawContent === "string" ? rawContent.trim() : "";
    const errors = [];
    if (!to) errors.push({ field: "to", message: "`to` is required" });
    if (!content) errors.push({ field: "content", message: "`content` is required" });
    if (!to) errors.push({ field: "to", message: "`to` is required" });
    if (!content) errors.push({ field: "content", message: "`content` is required" });
    // simple length limits (adjust as you like)
    if (to && (to.length < 3 || to.length > 50)) {
        errors.push({ field: "to", message: "`to` must be between 3 and 50 characters" });
    }
    if (content && content.length > 500) {
        errors.push({ field: "content", message: "`content` must be at most 500 characters" });
    }
    if (errors.length > 0) {
        return res.status(400).json({ error: "Validation error", details: errors });
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
    //   start async send after response 
    if (this.messageService) {
        console.log('messageService!!!!!!!!!!!!!');
        this.messageService.startSend(message.id);
    }
  }

  getMessages(req, res) {
    console.log('********************** getMessages *******************');
    console.log('json(Array.from(this.messagesById.values())=>',Array.from(this.messagesById.values()));
    res.set("Cache-Control", "no-store");
    return res.json(Array.from(this.messagesById.values()));
  }

}

module.exports =  MessageController;

