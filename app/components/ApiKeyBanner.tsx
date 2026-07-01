"use client";

import { useSessionStore } from "../lib/sessionStore";

export function ApiKeyBanner() {
  const apiKey = useSessionStore((s) => s.session?.apiKey ?? "—");

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex flex-col gap-3">
      <div>
        <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1.5">
          X-Api-Key
        </p>
        <code className="text-sm font-mono font-medium text-amber-900 bg-amber-100 px-2.5 py-1 rounded-md">
          {apiKey}
        </code>
        <p className="text-xs text-amber-600 mt-1.5">This is a temporary demo API key.</p>
      </div>

      <p className="text-xs text-amber-700 leading-relaxed">
        In a real integration, this key should be stored securely on your backend server and sent
        to FlowForge in the <code className="font-mono bg-amber-100 px-1 rounded">X-Api-Key</code> HTTP
        header when creating webhook deliveries.
        <br /><br />
        For this demo, the key is shown on screen so you can understand how authentication works.
        The demo console automatically attaches this key to requests when you click "Send Test Webhook".
        <br /><br />
        <span className="font-semibold">
          Do not expose production API keys in frontend code, logs, public repositories, or browser storage.
        </span>
      </p>
    </div>
  );
}
