import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard, Section, StatusBadge } from "@/components/ui-kit/StatCard";
import { FileText, BookOpen, Briefcase, TrendingUp, Sparkles, Bell, Stamp, Mail, ClipboardCheck, AlertCircle, Send, Plus } from "lucide-react";
import { useQuickActions } from "@/lib/quickActions";
import { useStudentProfile, getTrainingProgress } from "@/lib/studentProfile";

export const Route = createFileRoute("/student/")({
  head: () => ({ meta: [{ title: "Student Dashboard — SIAMS" }] }),
  component: StudentDashboard,
});

const ACTIVITY = [
  { icon: Send, tone: "primary" as const, title: "You submitted Week 2 logbook", time: "2h ago" },
  { icon: Stamp, tone: "success" as const, title: "Acme Industries endorsed Week 1", time: "Yesterday" },
  { icon: Mail, tone: "primary" as const, title: "Letter sent to hr@acme-industries.co", time: "2d ago" },
  { icon: ClipboardCheck, tone: "success" as const, title: "Dr. Mwangi reviewed Week 8 entry", time: "3d ago" },
];

const NOTIFS = [
  { icon: AlertCircle, tone: "warning" as const, title: "Logbook not submitted", desc: "Week 9 is due in 2 days.", time: "1h ago" },
  { icon: Stamp, tone: "success" as const, title: "Company endorsed your entry", desc: "Week 1 has been endorsed by Acme.", time: "Yesterday" },
  { icon: ClipboardCheck, tone: "primary" as const, title: "Supervisor added feedback", desc: "Dr. Mwangi commented on Week 8.", time: "2d ago" },
];

const toneClasses: Record<"primary" | "success" | "warning", string> = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
};

function StudentDashboard() {
  const { setOpen } = useQuickActions();
  const { profile } = useStudentProfile();
  const { week, total } = getTrainingProgress(profile);
  const pct = Math.round((week / total) * 100);

  return (
    <AppShell title="Dashboard">
      <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 lg:p-8 shadow-elevated">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="text-xs font-medium opacity-80 uppercase tracking-wider">Welcome back</div>
            <h2 className="mt-1 text-2xl font-semibold">Hi Amina 👋</h2>
            <p className="mt-1 text-sm opacity-85 max-w-md">
              You have 3 recommended companies waiting for you and 1 logbook entry due this week.
            </p>
            {profile.completed && (
              <div className="mt-3 max-w-sm">
                <div className="flex items-center justify-between text-[11px] opacity-90 font-medium">
                  <span>Training progress · Week {week} of {total}</span>
                  <span>{pct}%</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-white/20 overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur rounded-lg px-3 py-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-medium">{profile.completed ? `Week ${week} of ${total}` : "AI matches refreshed"}</span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button onClick={() => setOpen("letter")} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur text-sm font-medium transition-colors">
            <FileText className="h-4 w-4" /> Generate letter
          </button>
          <button onClick={() => setOpen("newEntry")} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur text-sm font-medium transition-colors">
            <Plus className="h-4 w-4" /> New entry
          </button>
          <button onClick={() => setOpen("submitWeek")} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-white text-primary hover:bg-white/90 text-sm font-semibold transition-colors">
            <Send className="h-4 w-4" /> Submit week
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard label="Applications Submitted" value="6" hint="2 awaiting reply" icon={FileText} tone="primary" />
        <StatCard label="Logbook Progress" value="8 / 12" hint="On schedule" icon={BookOpen} tone="success" />
        <StatCard label="Attachment Status" value="Active" hint="Acme Industries" icon={Briefcase} tone="primary" />
        <StatCard label="Performance" value="A−" hint="Top 15%" icon={TrendingUp} tone="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Recent activity */}
        <div className="lg:col-span-2">
          <Section title="Recent Activity">
            <div className="rounded-xl border border-border bg-card divide-y divide-border shadow-card">
              {ACTIVITY.map((row, i) => {
                const Icon = row.icon;
                return (
                  <div key={i} className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${toneClasses[row.tone]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{row.title}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{row.time}</div>
                    </div>
                    <StatusBadge status="Approved" />
                  </div>
                );
              })}
            </div>
          </Section>
        </div>

        {/* Notifications panel */}
        <div>
          <Section title="Notifications" action={<button className="text-xs font-medium text-primary hover:underline">Mark all read</button>}>
            <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border bg-muted/40 flex items-center gap-2">
                <Bell className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">3 unread</span>
              </div>
              <div className="divide-y divide-border">
                {NOTIFS.map((n, i) => {
                  const Icon = n.icon;
                  return (
                    <div key={i} className="p-3.5 hover:bg-muted/30 transition-colors flex items-start gap-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${toneClasses[n.tone]}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium leading-tight">{n.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{n.desc}</div>
                        <div className="text-[10px] text-muted-foreground mt-1">{n.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Section>
        </div>
      </div>
    </AppShell>
  );
}
