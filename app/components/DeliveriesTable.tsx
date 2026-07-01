"use client";

import { Fragment, useEffect, useState } from "react";
import {
  DeliveryAttemptDto,
  DeliveryListItemView,
  DeliveryStatus,
  DeliveryStreamEvent,
  toDeliveryListItemView,
  WebhookDeliveryDto,
} from "../types/delivery";
import { PagedResultDto } from "../types/pagination";
import { statusConfig } from "../constants/statusConfig";
import { deliveryService } from "../services/deliveryService";
import { connectSse } from "../lib/sseClient";
import { StatusBadge } from "./StatusBadge";
import { DeadLetterWarning } from "./DeadLetterWarning";
import { RetryFromDeadLetterButton } from "./RetryFromDeadLetterButton";
import PaginationControls from "./PaginationControls";
import DeliveryAttemptsRow from "./DeliveryAttemptsRow";

const PAGE_SIZE = 10;

const COLUMNS = [
  "ID",
  "ENDPOINT",
  "EVENT",
  "STATUS",
  "ATTEMPTS",
  "DURATION",
  "RECEIVED",
  "ACTION",
];

type FilterTab =
  | "All"
  | DeliveryStatus.Succeeded
  | DeliveryStatus.InProgress
  | DeliveryStatus.Pending;

const FILTER_TABS: FilterTab[] = [
  "All",
  DeliveryStatus.Succeeded,
  DeliveryStatus.InProgress,
  DeliveryStatus.Pending,
];

function tabLabel(tab: FilterTab): string {
  if (tab === "All") return "All";
  return statusConfig[tab].label;
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100 last:border-0">
          {COLUMNS.map((col) => (
            <td key={col} className="px-4 py-3">
              <div
                className="h-3.5 rounded bg-gray-100 animate-pulse"
                style={{
                  width: col === "ID" ? 96 : col === "ACTION" ? 48 : 72,
                }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <tr>
      <td colSpan={COLUMNS.length} className="px-4 py-16 text-center">
        <p className="text-sm text-red-500 mb-3">{message}</p>
        <button
          onClick={onRetry}
          className="text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Retry
        </button>
      </td>
    </tr>
  );
}

function DeliveryRow({
  row,
  isLast,
  isExpanded,
  onToggle,
}: {
  row: DeliveryListItemView;
  isLast: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <tr
      onClick={onToggle}
      className={`hover:bg-gray-50 transition-colors cursor-pointer select-none ${
        !isLast ? "border-b border-gray-100" : ""
      }`}
    >
      <td className="px-4 py-3 text-gray-400 whitespace-nowrap truncate max-w-28">
        <div className="flex items-center gap-2">
          <svg
            className={`h-3 w-3 shrink-0 text-gray-300 transition-transform duration-150 ${
              isExpanded ? "rotate-90" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
          {row.id}
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-blue-600 font-medium text-sm">
          {row.endpointName}
        </span>
      </td>
      <td className="px-4 py-3 font-mono text-xs text-gray-700 whitespace-nowrap">
        {row.eventType}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <StatusBadge status={row.status} />
      </td>
      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
        {row.attemptsText}
      </td>
      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
        {row.durationText}
      </td>
      <td
        className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap"
        title={row.receivedAtTooltip}
      >
        {row.receivedAtText}
      </td>
      <td
        className="px-4 py-3 whitespace-nowrap"
        onClick={(e) => e.stopPropagation()}
      >
        {row.status === DeliveryStatus.DeadLettered && (
          <RetryFromDeadLetterButton deliveryId={row.id} />
        )}
      </td>
    </tr>
  );
}

export default function DeliveriesTable() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PagedResultDto<WebhookDeliveryDto> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // Full fetch with loading state — used on initial load and tab/page changes
  function fetchPage(p: number, status?: DeliveryStatus) {
    setLoading(true);
    setError(null);
    let cancelled = false;

    deliveryService.list(p, PAGE_SIZE, status).then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setError(result.message || "Failed to load deliveries.");
      } else {
        setData(result.data);
        setExpandedIds(new Set());
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }

  // Silent re-fetch triggered by SSE events — no loading spinner
  function silentRefresh(p: number, status?: DeliveryStatus) {
    deliveryService.list(p, PAGE_SIZE, status).then((result) => {
      if (result.ok) setData(result.data);
    });
  }

  function handleTabChange(tab: FilterTab) {
    setPage(1);
    setActiveTab(tab);
  }

  useEffect(
    () => fetchPage(page, activeTab === "All" ? undefined : activeTab),
    [page, activeTab],
  );

  // Open SSE stream on mount; re-fetch silently when any delivery event arrives
  useEffect(() => {
    const connection = connectSse<DeliveryStreamEvent>(
      "/WebhookDelivery/stream",
      () => {
        silentRefresh(page, activeTab === "All" ? undefined : activeTab);
      },
    );
    return () => connection.close();
  }, [page, activeTab]);

  const rows = (data?.items ?? []).map((dto) => ({
    view: toDeliveryListItemView(dto),
    attempts: dto.deliveryAttempts as DeliveryAttemptDto[],
  }));

  return (
    <div>
      <DeadLetterWarning />

      <div className="mb-5 mt-1.5">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1">
          All Deliveries
        </p>
        <h2 className="text-2xl font-bold text-gray-900">Deliveries</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          {data ? `${data.totalCount} total deliveries` : "—"}
        </p>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`text-sm px-3 py-1 rounded-full border transition-colors cursor-pointer ${
              activeTab === tab
                ? "bg-gray-900 text-white border-gray-900"
                : "text-gray-600 border-gray-300 hover:border-gray-500 hover:text-gray-900 bg-white"
            }`}
          >
            {tabLabel(tab)}
          </button>
        ))}
        <span className="ml-auto text-sm text-gray-400">
          Showing {loading ? "—" : rows.length}
        </span>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden min-h-132">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  className="text-left text-xs font-semibold tracking-wider text-gray-400 uppercase px-4 py-3 whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows />
            ) : error ? (
              <ErrorState message={error} onRetry={() => fetchPage(page)} />
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="px-4 py-16 text-center text-sm text-gray-400"
                >
                  No deliveries found.
                </td>
              </tr>
            ) : (
              rows.map(({ view, attempts }, i) => (
                <Fragment key={view.id}>
                  <DeliveryRow
                    row={view}
                    isLast={i === rows.length - 1 && !expandedIds.has(view.id)}
                    isExpanded={expandedIds.has(view.id)}
                    onToggle={() => toggleExpand(view.id)}
                  />
                  {expandedIds.has(view.id) && (
                    <DeliveryAttemptsRow
                      attempts={attempts}
                      colSpan={COLUMNS.length}
                    />
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <PaginationControls
          page={data.page}
          totalPages={data.totalPages}
          hasNext={data.hasNextPage}
          hasPrev={data.hasPreviousPage}
          onNext={() => setPage((p) => p + 1)}
          onPrev={() => setPage((p) => p - 1)}
        />
      )}
    </div>
  );
}
