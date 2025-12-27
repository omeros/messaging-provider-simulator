import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Messaging Provider Simulator
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                A small full-stack messaging system that simulates sending messages via an external
                provider. It showcases idempotent request handling, retries, and clear separation of
                concerns.
            </p>
            </div>
            <div className="flex gap-2">
            <Link to="/send" className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800" > Send a message </Link>
            <Link to="/messages" className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50">View messages</Link>
            </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <FeatureCard title="Provider abstraction" text="Swappable provider layer with a fake provider that simulates latency and failures." />
            <FeatureCard title="Reliability" text="Automatic retries on failures and clear status transitions (pending → sending → sent/failed)." />
            <FeatureCard title="Idempotency" text="Duplicate requests (same idempotency key) are handled once—no duplicate messages."  />
        </div>
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-800">Quick start</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Server</p>
                <p className="mt-1 font-mono text-xs text-slate-700">
                cd server && npm i && npm start
                </p>
                <p className="mt-1 text-xs text-slate-500">Runs on :3001</p>
            </div>
            <div className="rounded-lg bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Client</p>
                <p className="mt-1 font-mono text-xs text-slate-700">
                cd client && npm i && npm run dev
                </p>
                <p className="mt-1 text-xs text-slate-500">Runs on :5173</p>
            </div>
            </div>
        </div>
        </div>
    );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
        </div>
    );
}
