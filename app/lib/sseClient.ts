import { useSessionStore } from "./sessionStore";
import { API_BASE_URL } from "./apiClient";

export interface SseConnection {
  close: () => void;
}

/**
 * Opens an SSE stream via fetch so we can send the X-Api-Key header,
 * which the native EventSource API does not support.
 *
 * Parses each `data: <json>` line and calls onMessage with the decoded value.
 * Returns a handle whose close() aborts the connection.
 */
export function connectSse<T>(
  path: string,
  onMessage: (data: T) => void,
  onError?: (err: Error) => void,
): SseConnection {
  const apiKey = useSessionStore.getState().session?.apiKey;
  const controller = new AbortController();
  let closed = false;

  async function connect() {
    try {
      const res = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
          Accept: "text/event-stream",
          "Cache-Control": "no-cache",
          ...(apiKey ? { "X-Api-Key": apiKey } : {}),
        },
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        onError?.(new Error(`SSE connection failed: ${res.status}`));
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // Read chunks until the stream closes or close() is called
      while (!closed) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE events are delimited by double newlines
        const events = buffer.split("\n\n");
        // Keep the last (possibly incomplete) chunk in the buffer
        buffer = events.pop() ?? "";

        for (const event of events) {
          const dataLine = event
            .split("\n")
            .find((line) => line.startsWith("data:"));
          if (!dataLine) continue;

          const json = dataLine.slice("data:".length).trim();
          try {
            onMessage(JSON.parse(json) as T);
          } catch {
            // skip malformed payloads
          }
        }
      }
    } catch (err) {
      // AbortError means close() was called intentionally — not an error
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (!closed) {
        onError?.(err instanceof Error ? err : new Error("SSE error"));
      }
    }
  }

  connect();

  return {
    close() {
      closed = true;
      controller.abort();
    },
  };
}
