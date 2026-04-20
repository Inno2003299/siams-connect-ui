import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useRole } from "@/lib/role";
import { Navigate } from "@tanstack/react-router";

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const { isAuthed } = useRole();
  if (!isAuthed) return <Navigate to="/login" />;
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar title={title} />
        <main className="p-4 lg:p-8 max-w-[1400px] mx-auto">{children}</main>
      </div>
    </div>
  );
}
