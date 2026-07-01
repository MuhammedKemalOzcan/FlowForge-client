"use client";

import { useSessionStore } from "../lib/sessionStore";
import { WebhookEndpointDto } from "../types/webhook";

interface Props {
  endpoint: WebhookEndpointDto;
}

export function WebhookRequestPreview({ endpoint }: Props) {
  const apiKey = useSessionStore((s) => s.session?.apiKey ?? "—");

  const body = JSON.stringify(
    {
      endpointId: endpoint.id,
      eventType: endpoint.eventTypes[0] ?? "event.triggered",
      payload: JSON.stringify({
        id: "test_evt_001",
        timestamp: "2026-05-25T12:00:00Z",
      }),
    },
    null,
    2
  );

  return (
    <div className="mt-3 rounded-lg bg-gray-950 font-mono text-xs overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-800">
        <span className="text-emerald-400 font-semibold">POST</span>
        <span className="text-gray-200">/api/webhook-deliveries</span>
        <span className="ml-auto text-gray-600">HTTP/1.1</span>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-800 space-y-1">
        <div>
          <span className="text-blue-400">X-Api-Key</span>
          <span className="text-gray-600">: </span>
          <span className="text-amber-300">{apiKey}</span>
        </div>
        <div>
          <span className="text-blue-400">Content-Type</span>
          <span className="text-gray-600">: </span>
          <span className="text-amber-300">application/json</span>
        </div>
      </div>

      <pre className="px-4 py-3 text-gray-300 overflow-x-auto leading-relaxed">{body}</pre>
    </div>
  );
}
