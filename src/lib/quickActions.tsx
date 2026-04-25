import { createContext, useContext, useState, type ReactNode } from "react";

export type QuickActionModal =
  | "letter"
  | "newEntry"
  | "submitWeek"
  | "apply"
  | "upload"
  // company supervisor actions
  | "pendingLogbooks"
  | "evaluateStudent"
  | "viewStudents"
  | null;

type Ctx = {
  open: QuickActionModal;
  setOpen: (m: QuickActionModal) => void;
};

const QuickActionsContext = createContext<Ctx | null>(null);

export function QuickActionsProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<QuickActionModal>(null);
  return (
    <QuickActionsContext.Provider value={{ open, setOpen }}>{children}</QuickActionsContext.Provider>
  );
}

export function useQuickActions() {
  const ctx = useContext(QuickActionsContext);
  if (!ctx) throw new Error("useQuickActions must be used within QuickActionsProvider");
  return ctx;
}
