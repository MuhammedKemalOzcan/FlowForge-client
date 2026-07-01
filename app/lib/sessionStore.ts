import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { DemoSessionDto } from "../types/session";

interface SessionState {
  session: DemoSessionDto | null;
  setSession: (session: DemoSessionDto) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
    }),
    {
      name: "flowforge-session",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
