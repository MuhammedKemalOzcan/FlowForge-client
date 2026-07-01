import { format } from "date-fns";
import { DeliveryAttemptDto, OutcomeStatus } from "../types/delivery";
import { outcomeStatusConfig } from "../constants/statusConfig";

interface Props {
  attempts: DeliveryAttemptDto[];
  colSpan: number;
}

export default function DeliveryAttemptsRow({ attempts, colSpan }: Props) {
  return (
    <tr className="bg-gray-50 border-b border-gray-100">
      <td colSpan={colSpan} className="px-8 py-3">
        {attempts.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No attempts yet.</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400 uppercase tracking-wider">
                {["#", "Started", "Duration", "HTTP", "Outcome", "Error"].map(
                  (h) => (
                    <th key={h} className="text-left pb-2 pr-6 font-semibold">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {attempts.map((a) => (
                <tr key={a.id}>
                  <td className="py-1.5 pr-6 text-gray-500 font-medium">
                    {a.attemptNumber}
                  </td>
                  <td className="py-1.5 pr-6 font-mono text-gray-500">
                    {format(a.startedAt, "HH:mm:ss")}
                  </td>
                  <td className="py-1.5 pr-6 text-gray-500">
                    {a.durationMs != null ? `${a.durationMs}ms` : "—"}
                  </td>
                  <td className="py-1.5 pr-6">
                    <span
                      className={
                        a.statusCode != null && a.statusCode < 300
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      {a.statusCode ?? "—"}
                    </span>
                  </td>
                  <td
                    className={`py-1.5 pr-6 font-medium ${outcomeStatusConfig[a.outcomeStatus].color}`}
                  >
                    {outcomeStatusConfig[a.outcomeStatus].label}
                  </td>
                  <td className="py-1.5 text-gray-400 max-w-xs truncate">
                    {a.errorMessage ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </td>
    </tr>
  );
}
