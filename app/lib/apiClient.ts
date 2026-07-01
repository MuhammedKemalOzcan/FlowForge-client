import { useSessionStore } from "./sessionStore";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

// ─── Result type ────────────────────────────────────────────────────────────

export type ApiSuccess<T> = { ok: true; data: T | null };
export type ApiError = { ok: false; status: number; message: string };
export type ApiResult<T> = ApiSuccess<T> | ApiError;

// ─── Core fetch wrapper ──────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  skipAuth = false,
): Promise<ApiResult<T>> {
  const apiKey = useSessionStore.getState().session?.apiKey;
  const authHeaders: Record<string, string> =
    !skipAuth && apiKey ? { "X-Api-Key": apiKey } : {};

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...(options.headers as Record<string, string> | undefined),
      },
    });

    if (!res.ok) {
      const message = await res.text().catch(() => res.statusText);
      return { ok: false, status: res.status, message };
    }

    
    const text = await res.text();
    const data = text ? JSON.parse(text) as T : null;
    return { ok: true, data };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      message: err instanceof Error ? err.message : "Network error",
    };
  }
}

// ─── HTTP methods ────────────────────────────────────────────────────────────

export const apiClient = {
  get: <T>(path: string, opts?: { skipAuth?: boolean }) =>
    request<T>(path, {}, opts?.skipAuth),

  post: <T>(path: string, body: unknown, opts?: { skipAuth?: boolean }) =>
    request<T>(
      path,
      { method: "POST", body: JSON.stringify(body) },
      opts?.skipAuth,
    ),

  put: <T>(path: string, body: unknown, opts?: { skipAuth?: boolean }) =>
    request<T>(
      path,
      { method: "PUT", body: JSON.stringify(body) },
      opts?.skipAuth,
    ),

  patch: <T>(path: string, body: unknown, opts?: { skipAuth?: boolean }) =>
    request<T>(
      path,
      { method: "PATCH", body: JSON.stringify(body) },
      opts?.skipAuth,
    ),

  delete: <T>(path: string, opts?: { skipAuth?: boolean }) =>
    request<T>(path, { method: "DELETE" }, opts?.skipAuth),
};
