import { useEffect, useRef, useState } from "react";
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
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [intervalMs, setIntervalMs] = useState(1000);
    // prevents overlapping requests when polling is fast
    const isFetchingRef = useRef(false);

    async function load({ silent = false } = {}) {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    if (!silent) {
        setError(null);
        setLoading(true);
    }
    try {
        const data = await getMessages();
        setMessages([...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    } catch (err: any) {
        if (!silent) setError(err?.message ?? "Failed to load messages");
    } finally {
        if (!silent) setLoading(false);
        isFetchingRef.current = false;
    }
    }

    // initial load
    useEffect(() => {
        load();
        const id = setInterval(() => load({ silent: true }), 1000);
        return () => clearInterval(id);
    }, []);

    // polling (auto-refresh)
    useEffect(() => {
        if (!autoRefresh) return;

        const id = window.setInterval(() => {
        load();
        }, intervalMs);

        return () => window.clearInterval(id);
    }, [autoRefresh, intervalMs]); // keep load out to avoid re-creating interval

    function formatDate(iso: string) {
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return iso;
        return new Intl.DateTimeFormat(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }).format(d);
    }


  return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
            <h1 className="text-xl font-semibold text-slate-900">Messages</h1>
            <p className="mt-1 text-sm text-slate-600">In-memory list from the server.</p>
            </div>
            <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input  type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} className="h-4 w-4" /> Auto refresh </label>
                <select  value={intervalMs} onChange={(e) => setIntervalMs(Number(e.target.value))} disabled={!autoRefresh} className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm disabled:opacity-60"  title={!autoRefresh ? "Enable auto refresh to change interval" : undefined} >
                    <option value={1000}>1s</option>
                    <option value={1500}>1.5s</option>
                    <option value={2000}>2s</option>
                    <option value={3000}>3s</option>
                </select>
                <button
                    onClick={() => load()}
                    disabled={loading}
                    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                >
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            </div>
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
                    <td className="px-3 py-2 font-mono text-xs">{formatDate(m.createdAt)}</td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>
        </div>
  );
}


