import { RetryPolicyDto } from "../types/webhook";

interface Props {
  policy: RetryPolicyDto;
}

export function RetryPolicySummary({ policy }: Props) {
  return (
    policy && (
      <div>
        <p className="text-xs text-gray-400 mb-1">Retry Policy</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          <span>
            <span className="text-gray-400 text-xs">Max attempts </span>
            {policy.maxAttempts}
          </span>
          <span>
            <span className="text-gray-400 text-xs">Initial delay </span>
            {policy.initialDelaySeconds}s
          </span>
          <span>
            <span className="text-gray-400 text-xs">Max delay </span>
            {policy.maxDelaySeconds}s
          </span>
          <span>
            <span className="text-gray-400 text-xs">Strategy </span>
            {policy.strategy}
          </span>
          <span>
            <span className="text-gray-400 text-xs">Timeout </span>
            {policy.timeoutSeconds}s
          </span>
        </div>
      </div>
    )
  );
}
