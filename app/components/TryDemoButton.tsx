"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { bootstrapDemo } from "../services/demoService";
import { useSessionStore } from "../lib/sessionStore";

export default function TryDemoButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setSession = useSessionStore((s) => s.setSession);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    setError(null);

    const result = await bootstrapDemo();

    if (!result.ok) {
      setError(result.message || "Failed to start demo. Please try again.");
      setLoading(false);
      return;
    }

    if (!result.data) {
      setError("No session data returned. Please try again.");
      setLoading(false);
      return;
    }

    setSession(result.data);
    router.push("/");
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-400/40 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {loading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Setting up your demo…</span>
          </>
        ) : (
          <>
            <span>Try Demo</span>
            <svg
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </>
        )}
      </button>

      {error && (
        <p className="text-center text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
