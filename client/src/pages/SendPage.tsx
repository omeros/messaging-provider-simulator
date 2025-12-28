import { useMemo, useState } from "react";
import { sendMessage } from "../services/api";

function newIdempotencyKey() {
  return crypto.randomUUID();
}

const MAX_CONTENT = 500;

export default function SendPage() {
  const [to, setTo] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{ to?: string; content?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const trimmedTo = to.trim();
  const trimmedContent = content.trim();

  const clientValidation = useMemo(() => {
    const errors: { to?: string; content?: string } = {};

    if (!trimmedTo) errors.to = "Recipient (to) is required.";
    else if (trimmedTo.length < 3) errors.to = "Recipient (to) is too short.";
    else if (trimmedTo.length > 50) errors.to = "Recipient (to) is too long (max 50).";

    if (!trimmedContent) errors.content = "Message content is required.";
    else if (trimmedContent.length > MAX_CONTENT)
      errors.content = `Message is too long (max ${MAX_CONTENT} characters).`;

    return errors;
  }, [trimmedTo, trimmedContent]);

  const isValid = Object.keys(clientValidation).length === 0;

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSuccessId(null);
        setServerError(null);
        setFieldErrors({});
        // Run client validation
        if (!isValid) {
        setFieldErrors(clientValidation);
        return;
        }

    setLoading(true);
        try {
        const msg = await sendMessage(trimmedTo, trimmedContent, newIdempotencyKey());
        setSuccessId(msg.id);
        setTo("");
        setContent("");
        } catch (err: any) {
        // If backend returns JSON with { error, details }, you can parse it (optional)
        setServerError(err?.message ?? "Failed to send message.");
        } finally {
        setLoading(false);
        }
    }
  return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Send Message</h1>
        <p className="mt-1 text-sm text-slate-600">
            Create a message and let the backend send it asynchronously (with retries).
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {/* TO */}
            <div>
            <label className="block text-sm font-medium text-slate-700">To</label>
            <input
                value={to}
                onChange={(e) => {
                setTo(e.target.value);
                if (fieldErrors.to) setFieldErrors((p) => ({ ...p, to: undefined }));
                }}
                className={[
                "mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none",
                fieldErrors.to ? "border-red-300 focus:border-red-400" : "border-slate-300 focus:border-slate-400",
                ].join(" ")}
                placeholder='e.g. "+972501234567"'
                autoComplete="off"
            />
            {fieldErrors.to && <p className="mt-1 text-sm text-red-600">{fieldErrors.to}</p>}
            </div>

            {/* CONTENT */}
            <div>
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">Content</label>
                <span className="text-xs text-slate-500">
                {content.length}/{MAX_CONTENT}
                </span>
            </div>

            <textarea
                value={content}
                onChange={(e) => {
                setContent(e.target.value);
                if (fieldErrors.content) setFieldErrors((p) => ({ ...p, content: undefined }));
                }}
                className={[
                "mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none",
                fieldErrors.content
                    ? "border-red-300 focus:border-red-400"
                    : "border-slate-300 focus:border-slate-400",
                ].join(" ")}
                rows={5}
                placeholder="Write your message..."
            />

            {fieldErrors.content && <p className="mt-1 text-sm text-red-600">{fieldErrors.content}</p>}
            </div>

            {/* SERVER ERROR */}
            {serverError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {serverError}
            </div>
            )}

            {/* SUCCESS */}
            {successId && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                Message created: <span className="font-mono">{successId}</span>
            </div>
            )}

            <button
            disabled={loading || !isValid}
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            title={!isValid ? "Fix validation errors before sending" : undefined}
            >
            {loading ? "Sending..." : "Send"}
            </button>
        </form>
        </div>
    );
}


