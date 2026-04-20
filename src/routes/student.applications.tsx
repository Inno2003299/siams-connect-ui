import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui-kit/StatCard";
import { Building2 } from "lucide-react";

export const Route = createFileRoute("/student/applications")({
  head: () => ({ meta: [{ title: "Applications — SIAMS" }] }),
  component: Applications,
});

const ROWS = [
  { c: "Acme Industries", role: "ML Intern", date: "Apr 12", s: "Approved" as const },
  { c: "Safaricom PLC", role: "Backend Intern", date: "Apr 10", s: "Pending" as const },
  { c: "Twiga Foods", role: "Data Analyst Intern", date: "Apr 08", s: "Pending" as const },
  { c: "Kenya Power", role: "Grid Analytics", date: "Apr 02", s: "Rejected" as const },
  { c: "Equity Bank", role: "Software Intern", date: "Mar 28", s: "Approved" as const },
  { c: "BRCK", role: "Embedded Intern", date: "Mar 21", s: "Rejected" as const },
];

function Applications() {
  return (
    <AppShell title="Applications">
      <div className="flex items-center gap-3 flex-wrap mb-5">
        {(["All", "Pending", "Approved", "Rejected"] as const).map((t, i) => (
          <button
            key={t}
            className={`h-9 px-4 rounded-lg text-sm font-medium transition-colors ${
              i === 0 ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-5 py-3">Company</th>
              <th className="text-left font-medium px-5 py-3 hidden sm:table-cell">Role</th>
              <th className="text-left font-medium px-5 py-3 hidden md:table-cell">Applied</th>
              <th className="text-left font-medium px-5 py-3">Status</th>
              <th className="text-right font-medium px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ROWS.map((r) => (
              <tr key={r.c + r.role} className="hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary-soft flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">{r.c}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground hidden sm:table-cell">{r.role}</td>
                <td className="px-5 py-3.5 text-muted-foreground hidden md:table-cell">{r.date}</td>
                <td className="px-5 py-3.5"><StatusBadge status={r.s} /></td>
                <td className="px-5 py-3.5 text-right">
                  <button className="text-xs font-medium text-primary hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
