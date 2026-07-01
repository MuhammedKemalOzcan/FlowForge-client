"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "../lib/sessionStore";

// Redirects to /login if there is no active session.
// Returns null while redirecting so the protected content never flashes.
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const session = useSessionStore((s) => s.session);
  const router = useRouter();

  useEffect(() => {
    if (!session) router.replace("/login");
  }, [session, router]);

  if (!session) return null;

  return <>{children}</>;
}
