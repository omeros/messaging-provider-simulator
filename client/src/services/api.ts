import type { Message } from "../types/message";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

export async function sendMessage(to: string, content: string, idempotencyKey: string) {
    const res = await fetch(`${API_BASE}/messages/send`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify({ to, content }),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
    }
    return (await res.json()) as Message;
    }
    export async function getMessages() {
    const res = await fetch(`${API_BASE}/messages`, { method: "GET" });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
    }
    return (await res.json()) as Message[];
}
