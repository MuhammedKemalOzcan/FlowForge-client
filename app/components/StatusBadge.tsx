import { statusConfig } from "../constants/statusConfig";
import { DeliveryStatus } from "../types/delivery";

export function StatusBadge({ status }: { status: DeliveryStatus }) {
  
  const config = statusConfig[status];
  
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-sm font-medium ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
      {config.label}
    </span>
  );
}