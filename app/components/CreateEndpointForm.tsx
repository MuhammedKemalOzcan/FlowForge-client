"use client";

import { useState } from "react";
import { endpointService } from "../services/endpointService";
import type {
  BackoffStrategy,
  CreateWebhookEndpointRequest,
  WebhookEndpointDto,
} from "../types/webhook";
import { EventTypeInput } from "./EventTypeInput";

const STRATEGY_OPTIONS = [
  { label: "Fixed", value: 0 },
  { label: "Linear", value: 1 },
  { label: "Exponential", value: 2 },
];

/** Maps numeric strategy enum to the string label expected by WebhookEndpointDto. */
const STRATEGY_LABELS: Record<number, BackoffStrategy> = {
  0: "Fixed",
  1: "Linear",
  2: "Exponential",
};

/** Converts a seconds value to .NET TimeSpan string format "HH:MM:SS". */
function toTimespan(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

interface Props {
  onSuccess: (endpoint: WebhookEndpointDto) => void;
  onCancel: () => void;
}

export function CreateEndpointForm({ onSuccess, onCancel }: Props) {
  const [endpointName, setEndpointName] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [strategy, setStrategy] = useState(0);
  const [initialDelay, setInitialDelay] = useState(30);
  const [maxDelay, setMaxDelay] = useState(300);
  const [timeout, setTimeout] = useState(30);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Submits the form: POSTs to the API then constructs a complete DTO from local state. */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (eventTypes.length === 0) {
      setError("At least one event type is required.");
      return;
    }

    const req: CreateWebhookEndpointRequest = {
      endpointName,
      targetUrl,
      eventTypes,
      maxAttempts,
      strategy,
      initialDelay: toTimespan(initialDelay),
      maxDelay: toTimespan(maxDelay),
      timeout: toTimespan(timeout),
    };

    setSubmitting(true);
    const result = await endpointService.create(req);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message || "Failed to create endpoint.");
      return;
    }

    console.log(result.data);

    // The POST response shape may be incomplete (retryPolicy undefined).
    // Build a fully shaped WebhookEndpointDto from the form's local state instead.
    const built: WebhookEndpointDto = {
      id: result.data ?? crypto.randomUUID(),
      name: endpointName,
      targetUrl,
      eventTypes,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      retryPolicy: {
        maxAttempts,
        strategy: STRATEGY_LABELS[strategy],
        initialDelaySeconds: initialDelay,
        maxDelaySeconds: maxDelay,
        timeoutSeconds: timeout,
      },
    };

    onSuccess(built);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Endpoint Name">
        <input
          required
          type="text"
          value={endpointName}
          onChange={(e) => setEndpointName(e.target.value)}
          placeholder="My Endpoint"
          className={inputCls}
        />
      </Field>

      <Field label="Target URL">
        <input
          required
          type="url"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          placeholder="https://hooks.example.com/events"
          className={inputCls}
        />
      </Field>

      <Field label="Event Types">
        <EventTypeInput value={eventTypes} onChange={setEventTypes} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Max Attempts">
          <input
            required
            type="number"
            min={1}
            max={100}
            value={maxAttempts}
            onChange={(e) => setMaxAttempts(Number(e.target.value))}
            className={inputCls}
          />
        </Field>

        <Field label="Strategy">
          <select
            value={strategy}
            onChange={(e) => setStrategy(Number(e.target.value))}
            className={inputCls}
          >
            {STRATEGY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Initial Delay (s)">
          <input
            required
            type="number"
            min={1}
            value={initialDelay}
            onChange={(e) => setInitialDelay(Number(e.target.value))}
            className={inputCls}
          />
        </Field>

        <Field label="Max Delay (s)">
          <input
            required
            type="number"
            min={1}
            value={maxDelay}
            onChange={(e) => setMaxDelay(Number(e.target.value))}
            className={inputCls}
          />
        </Field>

        <Field label="Timeout (s)">
          <input
            required
            type="number"
            min={1}
            value={timeout}
            onChange={(e) => setTimeout(Number(e.target.value))}
            className={inputCls}
          />
        </Field>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="text-sm px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Creating…" : "Create Endpoint"}
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full text-sm rounded-lg border border-gray-200 px-3 py-1.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 bg-white";

/** Labeled form field wrapper. */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      {children}
    </div>
  );
}
