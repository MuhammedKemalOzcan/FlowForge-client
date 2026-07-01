import { create } from "zustand";
import type { WebhookEndpointDto } from "../types/webhook";

interface EndpointStore {
  endpoints: WebhookEndpointDto[];
  setEndpoints: (list: WebhookEndpointDto[]) => void;
  /** Prepends a newly created endpoint without a network round-trip. */
  addEndpoint: (endpoint: WebhookEndpointDto) => void;
  /** Removes an endpoint from the list by id. */
  removeEndpoint: (id: string) => void;
}

// In-memory only — endpoints are re-fetched on each session mount.
export const useEndpointStore = create<EndpointStore>()((set) => ({
  endpoints: [],
  setEndpoints: (list) => set({ endpoints: list }),
  addEndpoint: (endpoint) =>
    set((state) => ({ endpoints: [endpoint, ...state.endpoints] })),
  removeEndpoint: (id) =>
    set((state) => ({ endpoints: state.endpoints.filter((e) => e.id !== id) })),
}));
