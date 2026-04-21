import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard, Section, StatusBadge } from "@/components/ui-kit/StatCard";
import { Users, Stamp, CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/company/")({
  head: () => ({ meta: [{ title: "Company Dashboard — SIAMS" }] }),
  component: CompanyDashboard,
});

const QUEUE = [
  { name: "Amina Otieno", week: "Week 9", role: "Data Engineering Intern", status: "Pending" as const, time: "Today" },
  { name: "Brian Owino", week: "Week 9", role: "Backend Intern", status: "Pending" as const, time: "Today" },
  { name: "Faith Wanjiru", week: "Week 8", role: "QA Intern", status: "Approved" as const, time: "Yesterday" },
  { name: "Daniel Kiptoo", week: "Week 9", role: "Mobile Intern", status: "Pending" as const, time: "2d ago" },
];

function CompanyDashboard() {
  return (
    <AppShell title="Company Supervisor">
      <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 lg:p-8 shadow-elevated">
        <div className="text-xs font-medium opacity-80 uppercase tracking-wider">Acme Industries</div>
        <h2 className="mt-1 text-2xl font-semibold">Welcome, Peter 👋</h2>
        <p className="mt-1 text-sm opacity-85 max-w-md">
          You have 3 logbook entries waiting for your endorsement and 4 students under your supervision.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard label="Students Assigned" value="4" hint="Active interns" icon={Users} tone="primary" />
        <StatCard label="Pending Endorsements" value="3" hint="Awaiting your review" icon={Clock} tone="warning" />
        <StatCard label="Endorsed This Month" value="22" hint="+5 vs last month" icon={Stamp} tone="success" />
        <StatCard label="Approval Rate" value="94%" hint="Above average" icon={CheckCircle2} tone="success" />
      </div>

      <Section title="Endorsement queue">
        <div className="rounded-xl border border-border bg-card divide-y divide-border shadow-card">
          {QUEUE.map((q) => (
            <div key={q.name + q.week} className="flex items-center justify-between p-4 gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                  {q.name.split(" ").map((p) => p[0]).join("")}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{q.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{q.week} · {q.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-muted-foreground hidden sm:inline">{q.time}</span>
                <StatusBadge status={q.status} />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </AppShell>
  );
}
