import { RetryPolicyDto } from "./webhook";
import { format, formatDistanceToNow } from "date-fns";

export enum DeliveryStatus {
  Pending = 0,
  Queued = 1,
  InProgress = 2,
  Succeeded = 3,
  DeadLettered = 4,
}

export enum OutcomeStatus {
  Succeeded = 0,
  FailedWillRetry = 1,
  FailedFinal = 2,
}

export type WebhookDeliveryDto = {
  id: string;
  eventType: string;
  payload: string;
  status: DeliveryStatus;
  retryPolicy: RetryPolicyDto;
  endpointName: string;
  receivedAt: string;
  nextRetryAt: string | null;
  finalResultAt: string | null;
  deliveryAttempts: DeliveryAttemptDto[];
};

export interface DeliveryAttemptDto {
  id: string;
  attemptNumber: number;
  startedAt: string;
  completedAt: string | null;
  durationMs: number | null;
  statusCode: number | null;
  responseBody: string | null;
  errorMessage: string | null;
  outcomeStatus: OutcomeStatus;
}

export interface DeliveryListItemView {
  id: string;
  endpointName: string;
  eventType: string;
  status: DeliveryStatus;
  statusVariant: "success" | "warning" | "info" | "danger";
  attemptsText: string;
  durationText: string;
  receivedAtText: string;
  receivedAtTooltip: string;
}

export function toDeliveryListItemView(
  delivery: WebhookDeliveryDto,
): DeliveryListItemView {
  const lastAttempt = delivery.deliveryAttempts.at(-1);

  return {
    id: delivery.id,
    endpointName: delivery.endpointName,
    eventType: delivery.eventType,
    status: delivery.status,
    statusVariant: statusToVariant(delivery.status),
    attemptsText: `${delivery.deliveryAttempts.length}/${delivery.retryPolicy.maxAttempts}`,
    durationText:
      lastAttempt?.durationMs != null ? `${lastAttempt.durationMs}ms` : "--",
    receivedAtText: formatDistanceToNow(delivery.receivedAt, {
      addSuffix: true,
    }),
    receivedAtTooltip: format(delivery.receivedAt, "MMM d, yyyy HH:mm:ss"),
  };
}

// Shape of a server-sent event from /WebhookDelivery/stream
export interface DeliveryStreamEvent {
  eventName: string;
  deliveryId: string;
  tenantId: string;
  endpointId: string;
  eventType: string;
  status: string; // backend sends string name e.g. "Succeeded", not numeric enum
  attemptNumber: number | null;
  statusCode: number | null;
  durationMs: number | null;
  errorMessage: string | null;
  nextRetryAt: string | null;
  occurredAt: string;
}

function statusToVariant(status: DeliveryStatus) {
  switch (status) {
    case DeliveryStatus.Succeeded:
      return "success";
    case DeliveryStatus.Pending:
    case DeliveryStatus.Queued:
      return "warning";
    case DeliveryStatus.InProgress:
      return "info";
    case DeliveryStatus.DeadLettered:
      return "danger";
  }
}
