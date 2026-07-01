import { DeliveryStatus, OutcomeStatus } from "../types/delivery";

export const statusConfig: Record<
  DeliveryStatus,
  { label: string; dot: string; text: string }
> = {
  [DeliveryStatus.Succeeded]: {
    label: "Success",
    dot: "bg-green-500",
    text: "text-green-600",
  },
  [DeliveryStatus.InProgress]: {
    label: "In Progress",
    dot: "bg-blue-500",
    text: "text-blue-600",
  },
  [DeliveryStatus.Pending]: {
    label: "Pending",
    dot: "bg-orange-400",
    text: "text-orange-500",
  },
  [DeliveryStatus.DeadLettered]: {
    label: "Dead Letter",
    dot: "bg-red-500",
    text: "text-red-600",
  },
  [DeliveryStatus.Queued]: {
    label: "Queued",
    dot: "bg-yellow-300",
    text: "bg-yellow-300",
  },
};

export const outcomeStatusConfig: Record<
  OutcomeStatus,
  { label: string; color: string }
> = {
  [OutcomeStatus.Succeeded]: { label: "Succeeded", color: "text-green-600" },
  [OutcomeStatus.FailedWillRetry]: {
    label: "Failed Will Retry",
    color: "text-orange-500",
  },
  [OutcomeStatus.FailedFinal]: { label: "Failed Final", color: "text-red-700" },
};
