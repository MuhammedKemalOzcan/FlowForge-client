import { WebhookEndpointDto } from "../types/webhook";
import { EventTypeList } from "./EventTypeList";
import { RetryPolicySummary } from "./RetryPolicySummary";
import { DeleteEndpointButton } from "./DeleteEndpointButton";

interface Props {
  endpoint: WebhookEndpointDto;
}

/** Displays endpoint info: name, status, URL, event types, retry policy. No actions. */
export default function EndpointCard({ endpoint }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">{endpoint.name}</h2>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${endpoint.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
            {endpoint.isActive ? "Active" : "Inactive"}
          </span>
          <DeleteEndpointButton endpointId={endpoint.id} />
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-0.5">Target URL</p>
        <p className="text-sm font-mono text-gray-700 break-all">{endpoint.targetUrl}</p>
      </div>

      <EventTypeList eventTypes={endpoint.eventTypes} />

      <RetryPolicySummary policy={endpoint.retryPolicy} />
    </div>
  );
}
