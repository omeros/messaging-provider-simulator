class FakeProvider {
    constructor({ failureRate = 0.3, minDelayMs = 300, maxDelayMs = 1500 } = {}) {
        this.failureRate = failureRate;
        this.minDelayMs = minDelayMs;
        this.maxDelayMs = maxDelayMs;
    }

    send({ to, content }) {
        const delay = this.minDelayMs + Math.floor(Math.random() * (this.maxDelayMs - this.minDelayMs + 1));
        return new Promise((resolve, reject) => {
        setTimeout(() => {
            const failed = Math.random() < this.failureRate;
            if (failed) {
            const err = new Error("FakeProvider: simulated failure");
            err.code = "PROVIDER_FAILED";
            console.log("[provider] failed"); // ok
            return reject(err);              //  reject
            }
            console.log("[provider] sent");
            return resolve({ providerMessageId: `fake_${Date.now()}` });
        }, delay);
        });
    }
    

}

module.exports = FakeProvider;
