"use client";

import { useEffect, useState } from "react";
import { endpointService } from "../services/endpointService";
import { useEndpointStore } from "../lib/endpointStore";
import type { WebhookEndpointDto } from "../types/webhook";
import EndpointCard from "./EndpointCard";
import { EndpointTestSection } from "./EndpointTestSection";
import { CreateEndpointModal } from "./CreateEndpointModal";

export function EndpointsSection() {
  const { endpoints, setEndpoints, addEndpoint } = useEndpointStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  /** Fetches the endpoint list from the API and populates the store. Runs once on mount. */
  async function fetchEndpoints() {
    setLoading(true);
    setError(null);
    const result = await endpointService.list();
    if (!result.ok) {
      setError(result.message || "Failed to load endpoints.");
    } else {
      setEndpoints(result.data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchEndpoints();
  }, []);

  /** Adds the newly created endpoint to the store without a network round-trip. */
  function handleCreated(endpoint: WebhookEndpointDto) {
    addEndpoint(endpoint);
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            FlowForge Demo
          </h1>
          <p className="text-sm text-gray-500">
            Webhook delivery engine — registered endpoints
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Endpoint
        </button>
      </div>

      {loading && (
        <div className="text-sm text-gray-400 py-8 text-center">
          Loading endpoints…
        </div>
      )}

      {!loading && error && (
        <div className="text-sm text-red-500 py-4">{error}</div>
      )}

      {!loading && !error && endpoints.length === 0 && (
        <div className="text-sm text-gray-400 py-8 text-center">
          No endpoints yet. Create one to get started.
        </div>
      )}

      {!loading && !error && endpoints.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {endpoints.map(
            (endpoint) =>
              endpoint.isActive && (
                <div key={endpoint.id} className="flex flex-col gap-2">
                  <EndpointCard endpoint={endpoint} />
                  <EndpointTestSection endpoint={endpoint} />
                </div>
              ),
          )}
        </div>
      )}

      {showModal && (
        <CreateEndpointModal
          onSuccess={(endpoint) => {
            handleCreated(endpoint);
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
