import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { DemoSessionDto } from "../types/session";

interface SessionState {
  session: DemoSessionDto | null;
  // True once the persisted session has been read back from sessionStorage.
  // AuthGuard must wait for this before deciding whether to redirect,
  // otherwise it sees `session: null` for a tick on every refresh and
  // bounces straight to /login even when a valid session exists.
  hasHydrated: boolean;
  setSession: (session: DemoSessionDto) => void;
  clearSession: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      hasHydrated: false,
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "flowforge-session",
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
