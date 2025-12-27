function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

class MessageService {
  constructor({ provider, messagesById, maxAttempts = 3, baseDelayMs = 500 } = {}) {
    this.provider = provider;
    this.messagesById = messagesById;
    this.maxAttempts = maxAttempts;
    this.baseDelayMs = baseDelayMs;
    // for not sending twice the same message:
    this.inFlight = new Set(); // messageId
  }

  _setStatus(messageId, status) {
        const msg = this.messagesById.get(messageId);
        if (!msg) return;
        msg.status = status;
      // Also store "updatedAt" so it’s easier to sort and display in the UI
        msg.updatedAt = new Date().toISOString();
        console.log(`[message] ${msg.id} status=${msg.status}`);
  }

  startSend(messageId) {
         // Fire-and-forget: we don't wait for the send result before returning 202 to the client
        if (this.inFlight.has(messageId)) return;
        this.inFlight.add(messageId);
        this._sendWithRetry(messageId)
        .catch(() => {}) // errors are handled inside _sendWithRetry (it sets status to "failed" when needed) 
        .finally(() => this.inFlight.delete(messageId));
  }

  async _sendWithRetry(messageId) {
        const msg = this.messagesById.get(messageId);
        if (!msg) return;
        // if it send/failed already we do not touch
        if (msg.status === "sent" || msg.status === "failed") return;
        for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
        try {
            this._setStatus(messageId, "sending");
            await this.provider.send({ to: msg.to, content: msg.content });
            this._setStatus(messageId, "sent");
            return;
        } catch (err) {
            console.log(`[message] ${messageId} attempt ${attempt} failed: ${err?.message}`);
            if (attempt === this.maxAttempts) {
            this._setStatus(messageId, "failed");
            return;
            }
            // exponential backoff פשוט
            const waitMs = this.baseDelayMs * attempt;
            await sleep(waitMs);
        }
        }
  }
}

module.exports = MessageService;
