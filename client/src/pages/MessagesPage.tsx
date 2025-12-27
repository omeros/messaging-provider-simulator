import { useEffect, useState } from "react";
import { getMessages } from "../services/api";
import type { Message } from "../types/message";

function statusBadge(status: Message["status"]) {
    const base = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";
    switch (status) {
        case "sent":
        return `${base} bg-emerald-100 text-emerald-800`;
        case "failed":
        return `${base} bg-red-100 text-red-800`;
        case "sending":
        return `${base} bg-blue-100 text-blue-800`;
        default:
        return `${base} bg-slate-100 text-slate-800`;
  }
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    async function load() {
        setError(null);
        setLoading(true);
        try {
            const data = await getMessages();
            // newest first
            setMessages([...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
        } catch (err: any) {
            setError(err?.message ?? "Failed to load messages");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        load();
    }, []);
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
            <div>
                <h1 className="text-xl font-semibold text-slate-900">Messages</h1>
                <p className="mt-1 text-sm text-slate-600">In-memory list from the backend.</p>
            </div>
            <button onClick={load} disabled={loading} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 disabled:opacity-60">{loading ? "Refreshing..." : "Refresh"}</button>
        </div>
        {error && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
            </div>
        )}
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
                <tr>
                    <th className="px-3 py-2">To</th>
                    <th className="px-3 py-2">Content</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Created</th>
                </tr>
            </thead>
            <tbody>
                {messages.length === 0 && !loading ? (
                <tr>
                    <td className="px-3 py-3 text-slate-600" colSpan={4}>
                    No messages yet.
                    </td>
                </tr>
                ) : (
                messages.map((m) => (
                    <tr key={m.id} className="border-t border-slate-200">
                    <td className="px-3 py-2 font-mono text-xs">{m.to}</td>
                    <td className="px-3 py-2">{m.content}</td>
                    <td className="px-3 py-2">
                        <span className={statusBadge(m.status)}>{m.status}</span>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">{m.createdAt}</td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>
        </div>
    );
}
