"use client";

import type { WebhookEndpointDto } from "../types/webhook";
import { CreateEndpointForm } from "./CreateEndpointForm";

interface Props {
  /** Called with the fully constructed endpoint after a successful creation. */
  onSuccess: (endpoint: WebhookEndpointDto) => void;
  onClose: () => void;
}

/** Modal overlay that hosts the endpoint creation form. Closes on backdrop click. */
export function CreateEndpointModal({ onSuccess, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">New Webhook Endpoint</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <CreateEndpointForm onSuccess={onSuccess} onCancel={onClose} />
      </div>
    </div>
  );
}
