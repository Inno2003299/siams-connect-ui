import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Section, StatusBadge } from "@/components/ui-kit/StatCard";
import { Stamp, AlertTriangle, Sparkles, TrendingDown, Filter } from "lucide-react";
import { useState } from "react";
import { ASSIGNED_STUDENTS, WEEK_LOGS, type WeekLog } from "@/lib/companyData";
import { LogbookReviewModal } from "@/components/modals/LogbookReviewModal";

export const Route = createFileRoute("/company/endorsements")({
  head: () => ({ meta: [{ title: "Endorsements — SIAMS" }] }),
  component: Endorsements,
});

const FILTERS = ["All", "Pending", "Endorsed", "Rejected"] as const;
type Filter = typeof FILTERS[number];

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

function Endorsements() {
  const [filter, setFilter] = useState<Filter>("All");
  const [logs, setLogs] = useState<WeekLog[]>(WEEK_LOGS);
  const [openId, setOpenId] = useState<string | null>(null);

  const counts: Record<Filter, number> = {
    All: logs.length,
    Pending: logs.filter((l) => l.status === "Pending").length,
    Endorsed: logs.filter((l) => l.status === "Endorsed").length,
    Rejected: logs.filter((l) => l.status === "Rejected").length,
  };

  const filtered = filter === "All" ? logs : logs.filter((l) => l.status === filter);
  const openLog = logs.find((l) => l.id === openId) ?? null;

  const onDecision = (id: string, decision: "Endorsed" | "Rejected") => {
    setLogs((prev) => prev.map((l) => (l.id === id ? { ...l, status: decision } : l)));
  };

  return (
    <AppShell title="Logbook Endorsements">
      <p className="text-sm text-muted-foreground mb-5">
        Review weekly entries from your interns. Open any submission to view daily entries, rate
        performance, and digitally endorse the logbook.
      </p>

      <div className="flex items-center gap-2 flex-wrap mb-5">
        <div className="inline-flex items-center gap-1 text-xs text-muted-foreground mr-1">
          <Filter className="h-3.5 w-3.5" /> Filter:
        </div>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-muted/70"
            }`}
          >
            {f}
            <span
              className={`text-[10px] px-1.5 rounded-full ${
                filter === f ? "bg-white/20" : "bg-card"
              }`}
            >
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      <Section title={`Weekly submissions (${filtered.length})`}>
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card py-10 text-center text-sm text-muted-foreground">
            No submissions match this filter.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((l) => {
              const s = ASSIGNED_STUDENTS.find((x) => x.id === l.studentId)!;
              const totalHours = l.daily.reduce((a, d) => a + d.hours, 0);
              return (
                <button
                  key={l.id}
                  onClick={() => setOpenId(l.id)}
                  className="w-full text-left rounded-xl border border-border bg-card p-4 lg:p-5 shadow-card hover:shadow-elevated hover:border-primary/40 transition-all"
                >
                  <div className="flex items-start gap-4 flex-wrap">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center shrink-0">
                        {s.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{s.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          Week {l.week} · {l.range} · {totalHours}h
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-muted-foreground hidden sm:inline">
                        {l.submittedAt}
                      </span>
                      <StatusBadge status={l.status} />
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-foreground/80 leading-relaxed line-clamp-2">
                    {l.summary}
                  </p>

                  {s.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
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

                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                    <Stamp className="h-3.5 w-3.5" /> Open & endorse →
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </Section>

      <LogbookReviewModal
        log={openLog}
        open={!!openLog}
        onClose={() => setOpenId(null)}
        onDecision={onDecision}
      />
    </AppShell>
  );
}
