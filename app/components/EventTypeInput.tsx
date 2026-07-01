"use client";

import { useState } from "react";

interface Props {
  value: string[];
  onChange: (types: string[]) => void;
}

export function EventTypeInput({ value, onChange }: Props) {
  const [draft, setDraft] = useState("");

  function add() {
    const trimmed = draft.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setDraft("");
  }

  function remove(type: string) {
    onChange(value.filter((t) => t !== type));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. order.created"
          className="flex-1 text-sm rounded-lg border border-gray-200 px-3 py-1.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
        <button
          type="button"
          onClick={add}
          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Add
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((type) => (
            <span
              key={type}
              className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
            >
              {type}
              <button
                type="button"
                onClick={() => remove(type)}
                className="text-gray-400 hover:text-gray-600"
                aria-label={`Remove ${type}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
