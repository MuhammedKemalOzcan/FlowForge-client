"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "../lib/sessionStore";

// Redirects to /login if there is no active session.
// Returns null while redirecting, and while the persisted session is still
// being read from sessionStorage, so the protected content never flashes
// and a page refresh doesn't bounce the user out before rehydration finishes.
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const session = useSessionStore((s) => s.session);
  const hasHydrated = useSessionStore((s) => s.hasHydrated);
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !session) router.replace("/login");
  }, [hasHydrated, session, router]);

  if (!hasHydrated || !session) return null;

  return <>{children}</>;
}
