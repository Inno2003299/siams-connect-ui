import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard, Section, StatusBadge } from "@/components/ui-kit/StatCard";
import { Users, ClipboardList, AlertTriangle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/supervisor/")({
  head: () => ({ meta: [{ title: "Supervisor Dashboard — SIAMS" }] }),
  component: SupervisorDashboard,
});

const ALERTS = [
  { name: "Brian Owino", reason: "Missed 2 logbooks in a row", risk: "At Risk" as const },
  { name: "Faith Wanjiru", reason: "Low engagement score (42%)", risk: "At Risk" as const },
  { name: "Daniel Kiptoo", reason: "Logbook flagged by AI", risk: "Needs Review" as const },
];

function SupervisorDashboard() {
  return (
    <AppShell title="Supervisor Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Students Assigned" value="24" hint="Across 3 cohorts" icon={Users} tone="primary" />
        <StatCard label="Pending Logbooks" value="11" hint="Review this week" icon={ClipboardList} tone="warning" />
        <StatCard label="Approved This Month" value="58" hint="+12 vs last month" icon={CheckCircle2} tone="success" />
        <StatCard label="At-Risk Students" value="3" hint="Low engagement" icon={AlertTriangle} tone="danger" />
      </div>

      <Section title="Engagement alerts">
        <div className="rounded-xl border border-border bg-card divide-y divide-border shadow-card">
          {ALERTS.map((a) => (
            <div key={a.name} className="flex items-center justify-between p-4 gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                  {a.name.split(" ").map((p) => p[0]).join("")}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{a.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{a.reason}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={a.risk} />
                <button className="text-xs font-medium text-primary hover:underline">Contact</button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="This week's review queue">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["Mon", "Tue", "Wed"].map((d, i) => (
            <div key={d} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{d}</div>
              <div className="mt-1 text-2xl font-semibold">{[4, 5, 2][i]}</div>
              <div className="text-xs text-muted-foreground mt-1">submissions to review</div>
            </div>
          ))}
        </div>
      </Section>
    </AppShell>
  );
}
