"use client";

import { useState } from "react";
import { endpointService } from "../services/endpointService";
import { useEndpointStore } from "../lib/endpointStore";

interface Props {
  endpointId: string;
}

/** Sends DELETE for the given endpoint and removes it from the store on success. */
export function DeleteEndpointButton({ endpointId }: Props) {
  const removeEndpoint = useEndpointStore((s) => s.removeEndpoint);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  /** Calls the delete API then removes the endpoint from local store state. */
  async function handleDelete() {
    setDeleting(true);
    setError(null);
    const result = await endpointService.remove(endpointId);
    console.log(endpointId);
    
    if (!result.ok) {
      setError(result.message || "Failed to delete endpoint.");
      setDeleting(false);
      return;
    }
    removeEndpoint(endpointId);
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleDelete}
        disabled={deleting}
        aria-label="Delete endpoint"
        className="text-gray-300 hover:text-red-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {deleting ? (
          <span className="w-3.5 h-3.5 block rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        )}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
