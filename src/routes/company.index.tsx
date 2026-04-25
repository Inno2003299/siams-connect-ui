import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard, Section, StatusBadge } from "@/components/ui-kit/StatCard";
import {
  Users,
  Stamp,
  CheckCircle2,
  Bell,
  AlertTriangle,
  Sparkles,
  TrendingDown,
  GraduationCap,
  Send,
} from "lucide-react";
import { useState } from "react";
import { ASSIGNED_STUDENTS, WEEK_LOGS } from "@/lib/companyData";
import { useQuickActions } from "@/lib/quickActions";
import { LogbookReviewModal } from "@/components/modals/LogbookReviewModal";

export const Route = createFileRoute("/company/")({
  head: () => ({ meta: [{ title: "Company Dashboard — SIAMS" }] }),
  component: CompanyDashboard,
});

const ACTIVITY = [
  { text: "You endorsed Week 8 logbook for Faith Wanjiru", time: "1h ago", tone: "success" as const },
  { text: "New logbook submitted by Amina Otieno (Week 9)", time: "Today, 10:24", tone: "primary" as const },
  { text: "Evaluation submitted for previous cohort", time: "2d ago", tone: "success" as const },
  { text: "Daniel Kiptoo submitted Week 9 logbook", time: "2d ago", tone: "primary" as const },
];

const NOTIFS = [
  { text: "3 logbooks awaiting your endorsement", time: "Now", tone: "warning" as const },
  { text: "Daniel Kiptoo flagged as low activity", time: "Today", tone: "danger" as const },
  { text: "Final evaluation pending for Faith Wanjiru", time: "Yesterday", tone: "warning" as const },
];

const toneDot = {
  success: "bg-success",
  warning: "bg-warning",
  primary: "bg-primary",
  danger: "bg-destructive",
} as const;

const tagClass = {
  "Consistent performer": "bg-success-soft text-success",
  "Late submission": "bg-warning-soft text-warning",
  "Low activity": "bg-destructive-soft text-destructive",
} as const;

const tagIcon = {
  "Consistent performer": Sparkles,
  "Late submission": AlertTriangle,
  "Low activity": TrendingDown,
} as const;

function CompanyDashboard() {
  const { setOpen } = useQuickActions();
  const [openLogId, setOpenLogId] = useState<string | null>(null);
  const pending = WEEK_LOGS.filter((l) => l.status === "Pending");
  const openLog = WEEK_LOGS.find((l) => l.id === openLogId) ?? null;

  return (
    <AppShell title="Company Supervisor">
      <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 lg:p-8 shadow-elevated">
        <div className="text-xs font-medium opacity-80 uppercase tracking-wider">Acme Industries</div>
        <h2 className="mt-1 text-2xl font-semibold">Welcome, Peter 👋</h2>
        <p className="mt-1 text-sm opacity-85 max-w-md">
          You have {pending.length} logbook entries awaiting endorsement and {ASSIGNED_STUDENTS.length}{" "}
          students under your supervision.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setOpen("pendingLogbooks")}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-white/15 hover:bg-white/25 text-sm font-medium transition-colors backdrop-blur"
          >
            <Stamp className="h-4 w-4" /> Review pending
          </button>
          <button
            onClick={() => setOpen("evaluateStudent")}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-white/15 hover:bg-white/25 text-sm font-medium transition-colors backdrop-blur"
          >
            <GraduationCap className="h-4 w-4" /> New evaluation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <StatCard
          label="Total Assigned Students"
          value={ASSIGNED_STUDENTS.length}
          hint="Active interns"
          icon={Users}
          tone="primary"
        />
        <StatCard
          label="Pending Logbook Endorsements"
          value={pending.length}
          hint="Awaiting your review"
          icon={Stamp}
          tone="warning"
        />
        <StatCard
          label="Completed Evaluations"
          value="1"
          hint="This cohort"
          icon={CheckCircle2}
          tone="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Endorsement queue */}
        <Section title="Endorsement queue">
          <div className="rounded-xl border border-border bg-card divide-y divide-border shadow-card">
            {pending.map((q) => {
              const s = ASSIGNED_STUDENTS.find((x) => x.id === q.studentId)!;
              return (
                <button
                  key={q.id}
                  onClick={() => setOpenLogId(q.id)}
                  className="w-full text-left flex items-center justify-between p-4 gap-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                      {s.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{s.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        Week {q.week} · {s.role}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-muted-foreground hidden sm:inline">
                      {q.submittedAt}
                    </span>
                    <StatusBadge status={q.status} />
                  </div>
                </button>
              );
            })}
            <div className="p-3">
              <Link
                to="/company/endorsements"
                className="block text-center text-xs font-medium text-primary hover:underline"
              >
                View all endorsements →
              </Link>
            </div>
          </div>
        </Section>

        {/* Recent activity */}
        <Section title="Recent activity">
          <div className="rounded-xl border border-border bg-card p-2 shadow-card">
            {ACTIVITY.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 px-3 py-2.5 border-b border-border/60 last:border-0"
              >
                <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${toneDot[a.tone]}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm leading-snug">{a.text}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          <div className="rounded-xl border border-border bg-card p-2 shadow-card">
            {NOTIFS.map((n, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 px-3 py-2.5 border-b border-border/60 last:border-0"
              >
                <Bell className={`h-4 w-4 shrink-0 mt-0.5 ${
                  n.tone === "danger" ? "text-destructive" : n.tone === "warning" ? "text-warning" : "text-primary"
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm leading-snug">{n.text}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Smart indicators / students at a glance */}
      <Section
        title="Students at a glance"
        action={
          <Link
            to="/company/students"
            className="text-xs font-medium text-primary hover:underline"
          >
            See all →
          </Link>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ASSIGNED_STUDENTS.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-border bg-card p-4 shadow-card flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center shrink-0">
                {s.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{s.name}</div>
                <div className="text-[11px] text-muted-foreground truncate">{s.role}</div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {s.tags.map((t) => {
                    const Icon = tagIcon[t];
                    return (
                      <span
                        key={t}
                        className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded ${tagClass[t]}`}
                      >
                        <Icon className="h-2.5 w-2.5" />
                        {t}
                      </span>
                    );
                  })}
                </div>
              </div>
              <StatusBadge status={s.status} />
            </div>
          ))}
        </div>
      </Section>

      <LogbookReviewModal
        log={openLog}
        open={!!openLog}
        onClose={() => setOpenLogId(null)}
      />

      <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1.5 mt-6">
        <Send className="h-3 w-3" /> Endorsements automatically notify the student and academic supervisor.
      </div>
    </AppShell>
  );
}
