import { useState } from "react";
import { sendMessage } from "../services/api";

function uuid() {
    return crypto.randomUUID();
}

export default function SendPage() {
    const [to, setTo] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successId, setSuccessId] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccessId(null);

        if (!to.trim() || !content.trim()) {
        setError("Both 'to' and 'content' are required.");
        return;
        }

        setLoading(true);
        try {
        const msg = await sendMessage(to.trim(), content.trim(), uuid());
        setSuccessId(msg.id);
        setTo("");
        setContent("");
        } catch (err: any) {
        setError(err?.message ?? "Failed to send");
        } finally {
        setLoading(false);
        }
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Send Message</h1>
        <p className="mt-1 text-sm text-slate-600">Creates a message and triggers async sending.</p>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <div>
            <label className="block text-sm font-medium text-slate-700">To</label>
            <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
                placeholder="e.g. +972501234567"
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-slate-700">Content</label>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
                rows={4}
                placeholder="Write your message..."
            />
            </div>
            {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
            </div>
            )}
            {successId && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                Message created: <span className="font-mono">{successId}</span>
            </div>
            )}
            <button
            disabled={loading}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            >
            {loading ? "Sending..." : "Send"}
            </button>
        </form>
        </div>
    );
}
