import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Section, StatusBadge } from "@/components/ui-kit/StatCard";
import { ASSIGNED_STUDENTS, type AssignedStudent, WEEK_LOGS } from "@/lib/companyData";
import { useState } from "react";
import { StudentProfileModal } from "@/components/modals/StudentProfileModal";
import { LogbookReviewModal } from "@/components/modals/LogbookReviewModal";
import { Search, AlertTriangle, Sparkles, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/company/students")({
  head: () => ({ meta: [{ title: "Assigned Students — SIAMS" }] }),
  component: StudentsPage,
});

const tagIcon = {
  "Consistent performer": Sparkles,
  "Late submission": AlertTriangle,
  "Low activity": TrendingDown,
} as const;

const tagClass = {
  "Consistent performer": "bg-success-soft text-success",
  "Late submission": "bg-warning-soft text-warning",
  "Low activity": "bg-destructive-soft text-destructive",
} as const;

function StudentsPage() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<AssignedStudent | null>(null);
  const [logId, setLogId] = useState<string | null>(null);

  const filtered = ASSIGNED_STUDENTS.filter(
    (s) =>
      !q ||
      s.name.toLowerCase().includes(q.toLowerCase()) ||
      s.institution.toLowerCase().includes(q.toLowerCase()) ||
      s.program.toLowerCase().includes(q.toLowerCase())
  );

  const openLog = WEEK_LOGS.find((l) => l.id === logId) ?? null;

  return (
    <AppShell title="Assigned Students">
      <p className="text-sm text-muted-foreground mb-5">
        Students currently under your supervision. Click any card to view their full profile and
        logbook history.
      </p>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, institution, program…"
          className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
      </div>

      <Section title={`Students (${filtered.length})`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((s) => {
            const progress = Math.round((s.weeksCompleted / s.totalWeeks) * 100);
            return (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className="text-left rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-elevated hover:border-primary/40 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center shrink-0">
                    {s.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold truncate">{s.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{s.role}</div>
                      </div>
                      <StatusBadge status={s.status} />
                    </div>
                    <div className="mt-2 text-[11px] text-muted-foreground">
                      {s.institution} · {s.program}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                    <span>Progress</span>
                    <span>
                      {s.weeksCompleted}/{s.totalWeeks} weeks
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                {s.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {s.tags.map((t) => {
                      const Icon = tagIcon[t];
                      return (
                        <span
                          key={t}
                          className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${tagClass[t]}`}
                        >
                          <Icon className="h-3 w-3" />
                          {t}
                        </span>
                      );
                    })}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Section>

      <StudentProfileModal
        student={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onOpenLog={(id) => {
          setSelected(null);
          setLogId(id);
        }}
      />
      <LogbookReviewModal
        log={openLog}
        open={!!openLog}
        onClose={() => setLogId(null)}
      />
    </AppShell>
  );
}
