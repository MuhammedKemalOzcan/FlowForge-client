"use client";

import { useState } from "react";
import { WebhookEndpointDto } from "../types/webhook";
import { webhookService } from "../services/webhookService";
import type { SendWebhookRequest } from "../types/webhook";
import { WebhookRequestPreview } from "./WebhookRequestPreview";

interface Props {
  endpoint: WebhookEndpointDto;
}

/** Send-test area rendered below each endpoint card. Manages delivery trigger state. */
export function EndpointTestSection({ endpoint }: Props) {
  const singleType = endpoint.eventTypes.length === 1 ? endpoint.eventTypes[0] : null;

  const [selectedType, setSelectedType] = useState(singleType ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const created = new Date(endpoint.createdAt).toLocaleDateString();
  const updated = new Date(endpoint.updatedAt).toLocaleDateString();

  /** Builds a test delivery request with the selected event type and sends it. */
  async function handleSend() {
    if (!selectedType) return;
    setSending(true);
    setError(null);
    setCreatedId(null);

    const req: SendWebhookRequest = {
      endpointId: endpoint.id,
      eventType: selectedType,
      payload: JSON.stringify({ id: crypto.randomUUID(), timestamp: new Date().toISOString() }),
      idempotencyKey: crypto.randomUUID(),
    };
    const result = await webhookService.send(req);

    if (!result.ok) {
      setError(result.message || "Failed to send webhook.");
    } else {
      setCreatedId(result.data);
      setIsOpen(true);
    }

    setSending(false);
  }

  return (
    <div className="px-4 py-3 rounded-xl border border-gray-100 bg-white flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5 text-xs text-gray-400 shrink-0">
          <span>Created {created}</span>
          <span>Updated {updated}</span>
        </div>

        <div className="flex items-center gap-2 min-w-0">
          {/* Show a dropdown when multiple event types exist; static label for single type */}
          {endpoint.eventTypes.length > 1 ? (
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs rounded-lg border border-gray-200 px-2 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 min-w-0 max-w-[160px] truncate"
            >
              <option value="">Select event type…</option>
              {endpoint.eventTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          ) : singleType ? (
            <span className="text-xs font-mono text-gray-500 truncate">{singleType}</span>
          ) : null}

          <button
            onClick={handleSend}
            disabled={sending || !selectedType}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {sending ? (
              <>
                <span className="w-3 h-3 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Send Test Webhook
              </>
            )}
          </button>
        </div>
      </div>

      {createdId && (
        <div className="flex items-center gap-1.5 text-xs text-green-600">
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          <span>
            Delivery queued ·{" "}
            <span className="font-mono text-green-700">{createdId}</span>
          </span>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {isOpen && <WebhookRequestPreview endpoint={endpoint} />}
    </div>
  );
}
