"use client";

import { useState } from "react";
import { deliveryService } from "../services/deliveryService";

interface Props {
  deliveryId: string;
  onSuccess?: () => void;
}

export function RetryFromDeadLetterButton({ deliveryId, onSuccess }: Props) {
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setRetrying(true);
    setError(null);

    const result = await deliveryService.requeue(deliveryId);

    if (!result.ok) {
      setError(result.message || "Requeue failed.");
      console.log(result.message);
    } else {
      onSuccess?.();
    }

    setRetrying(false);
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleClick}
        disabled={retrying}
        className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {retrying ? (
          <>
            <span className="w-3 h-3 rounded-full border-2 border-red-400 border-t-transparent animate-spin" />
            Requeueing…
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
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-4" />
            </svg>
            Retry
          </>
        )}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
