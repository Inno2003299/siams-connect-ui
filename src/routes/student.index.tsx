import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard, Section, StatusBadge } from "@/components/ui-kit/StatCard";
import { FileText, BookOpen, Briefcase, TrendingUp, Sparkles } from "lucide-react";

export const Route = createFileRoute("/student/")({
  head: () => ({ meta: [{ title: "Student Dashboard — SIAMS" }] }),
  component: StudentDashboard,
});

function StudentDashboard() {
  return (
    <AppShell title="Dashboard">
      <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 lg:p-8 shadow-elevated">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs font-medium opacity-80 uppercase tracking-wider">Welcome back</div>
            <h2 className="mt-1 text-2xl font-semibold">Hi Amina 👋</h2>
            <p className="mt-1 text-sm opacity-85 max-w-md">
              You have 3 recommended companies waiting for you and 1 logbook entry due this week.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur rounded-lg px-3 py-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-medium">AI matches refreshed</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard label="Applications Submitted" value="6" hint="2 awaiting reply" icon={FileText} tone="primary" />
        <StatCard label="Logbooks Submitted" value="8 / 12" hint="On schedule" icon={BookOpen} tone="success" />
        <StatCard label="Attachment Status" value="Active" hint="Acme Industries" icon={Briefcase} tone="primary" />
        <StatCard label="Performance" value="A−" hint="Top 15%" icon={TrendingUp} tone="warning" />
      </div>

      <Section title="Recent Activity">
        <div className="rounded-xl border border-border bg-card divide-y divide-border shadow-card">
          {[
            { t: "Logbook week 8 approved", s: "Approved" as const, w: "2h ago" },
            { t: "Applied to Safaricom PLC", s: "Pending" as const, w: "Yesterday" },
            { t: "Profile reviewed by Dr. Mwangi", s: "Approved" as const, w: "3d ago" },
          ].map((row) => (
            <div key={row.t} className="flex items-center justify-between p-4">
              <div className="text-sm font-medium">{row.t}</div>
              <div className="flex items-center gap-3">
                <StatusBadge status={row.s} />
                <span className="text-xs text-muted-foreground w-20 text-right">{row.w}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </AppShell>
  );
}
