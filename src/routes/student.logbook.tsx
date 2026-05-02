import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge, WorkflowPipeline, Section, type PipelineStage } from "@/components/ui-kit/StatCard";
import { useState } from "react";
import { Calendar, Check, Plus, Clock, Sparkles, AlertCircle, MessageSquare, Stamp, GraduationCap, Send } from "lucide-react";
import { useQuickActions } from "@/lib/quickActions";
import { NewEntryModal } from "@/components/modals/NewEntryModal";
import { useStudentProfile } from "@/lib/studentProfile";
import { LogbookOnboarding } from "@/components/logbook/LogbookOnboarding";

export const Route = createFileRoute("/student/logbook")({
  head: () => ({ meta: [{ title: "Logbook — SIAMS" }] }),
  component: Logbook,
});

type DailyEntry = {
  id: string;
  day: string;
  date: string;
  tasks: string;
  skills: string[];
  hours: number;
};

type Week = {
  label: string;
  range: string;
  stage: PipelineStage;
  qualityScore?: number;
  entries: DailyEntry[];
};

const PAST_WEEKS: Week[] = [
  {
    label: "Week 8",
    range: "Apr 14 – Apr 20",
    stage: "Finalized",
    qualityScore: 92,
    entries: [
      { id: "w8-1", day: "Mon", date: "Apr 14", tasks: "Built ETL job for churn dataset.", skills: ["Python", "Airflow"], hours: 8 },
      { id: "w8-2", day: "Tue", date: "Apr 15", tasks: "Wrote unit tests covering 4 edge cases.", skills: ["pytest"], hours: 7 },
      { id: "w8-3", day: "Wed", date: "Apr 16", tasks: "Deployed pipeline to staging.", skills: ["Docker", "Airflow"], hours: 8 },
      { id: "w8-4", day: "Thu", date: "Apr 17", tasks: "Ran 30-day backfill, validated metrics.", skills: ["BigQuery"], hours: 9 },
      { id: "w8-5", day: "Fri", date: "Apr 18", tasks: "Documented runbook in Notion.", skills: ["Notion"], hours: 6 },
    ],
  },
  {
    label: "Week 7",
    range: "Apr 07 – Apr 13",
    stage: "Reviewed",
    qualityScore: 85,
    entries: [
      { id: "w7-1", day: "Mon", date: "Apr 07", tasks: "Pair-programmed on the recommendation service.", skills: ["Python"], hours: 8 },
      { id: "w7-2", day: "Tue", date: "Apr 08", tasks: "Wrote 12 unit tests for the new endpoint.", skills: ["pytest"], hours: 7 },
    ],
  },
];

function todayMeta() {
  const now = new Date();
  return {
    day: now.toLocaleDateString("en-US", { weekday: "short" }),
    fullDay: now.toLocaleDateString("en-US", { weekday: "long" }),
    date: now.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    longDate: now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
    time: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
}

function Logbook() {
  const { profile } = useStudentProfile();

  // Show onboarding if profile not completed
  if (!profile.completed) {
    return <LogbookOnboarding />;
  }

  return <LogbookDashboard />;
}

function LogbookDashboard() {
  const [currentEntries, setCurrentEntries] = useState<DailyEntry[]>([]);
  const [stage, setStage] = useState<PipelineStage>("Draft");
  const { setOpen } = useQuickActions();
  const [localOpen, setLocalOpen] = useState(false);
  const meta = todayMeta();

  const addEntry = (e: { tasks: string; skills: string[]; hours: number }) => {
    const m = todayMeta();
    setCurrentEntries((prev) => [
      ...prev,
      { id: crypto.randomUUID(), day: m.day, date: m.date, tasks: e.tasks, skills: e.skills, hours: e.hours },
    ]);
  };

  const submitWeek = () => setStage("Submitted");

  const totalHours = currentEntries.reduce((s, e) => s + e.hours, 0);
  const canSubmit = currentEntries.length >= 3 && stage === "Draft";

  return (
    <AppShell title="Weekly Logbook">
      {/* Today banner */}
      <div className="rounded-xl border border-border bg-gradient-to-br from-primary-soft to-card p-5 lg:p-6 shadow-card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-primary">Today</div>
            <h2 className="mt-1 text-xl font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> {meta.longDate}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3 w-3" /> {meta.time} · date and time captured automatically
            </p>
          </div>
          <button
            onClick={() => setLocalOpen(true)}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add today's entry
          </button>
        </div>
      </div>

      {/* Current week workflow */}
      <Section title="Week 9 — current week">
        <div className="rounded-xl border border-border bg-card p-5 lg:p-6 shadow-card">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <div>
              <div className="text-sm font-semibold">Apr 21 – Apr 27</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {currentEntries.length} of 5 daily entries · {totalHours}h logged
              </div>
            </div>
            <StatusBadge status={stage} />
          </div>
          <WorkflowPipeline current={stage} />

          {currentEntries.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-border p-8 text-center">
              <Calendar className="h-8 w-8 mx-auto text-muted-foreground" />
              <div className="mt-2 text-sm font-medium">No entries yet for this week</div>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                Add at least 3 daily entries to submit the week for company endorsement.
              </p>
              <button
                onClick={() => setLocalOpen(true)}
                className="mt-4 inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" /> Add first entry
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-2.5">
              {currentEntries.map((e) => (
                <div key={e.id} className="border border-border rounded-lg p-3.5 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary-soft text-primary flex flex-col items-center justify-center">
                        <span className="text-[9px] font-semibold uppercase leading-none">{e.day}</span>
                        <span className="text-[11px] font-bold leading-tight">{e.date.split(" ")[1]}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium">{e.date}</div>
                        <div className="text-[11px] text-muted-foreground">{e.hours}h logged</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {e.skills.map((s) => (
                        <span key={s} className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-foreground/85 line-clamp-2">{e.tasks}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-border flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {currentEntries.length >= 3 ? (
                <span>AI quality score: <span className="font-semibold text-foreground">Good</span></span>
              ) : (
                <span className="inline-flex items-center gap-1 text-warning">
                  <AlertCircle className="h-3 w-3" /> Add {3 - currentEntries.length} more entries to submit
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLocalOpen(true)}
                className="h-10 px-4 rounded-lg border border-border bg-card text-sm font-medium hover:bg-muted"
              >
                <Plus className="h-4 w-4 inline -mt-0.5 mr-1" /> Add entry
              </button>
              <button
                onClick={submitWeek}
                disabled={!canSubmit}
                className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit week
              </button>
            </div>
          </div>

          {stage !== "Draft" && (
            <div className="mt-3 flex items-center gap-2 text-sm text-success bg-success-soft px-3 py-2 rounded-lg">
              <Check className="h-4 w-4" /> Week submitted! Awaiting company endorsement.
            </div>
          )}
        </div>
      </Section>

      {/* Past weeks timeline */}
      <Section title="Submission history" action={<button onClick={() => setOpen("letter")} className="text-xs font-medium text-primary hover:underline">Generate letter</button>}>
        <div className="space-y-4">
          {PAST_WEEKS.map((w) => (
            <div key={w.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div>
                  <div className="text-sm font-semibold">{w.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{w.range} · {w.entries.length} entries</div>
                </div>
                <div className="flex items-center gap-2">
                  {w.qualityScore && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-primary-soft text-primary px-2 py-0.5 rounded-full">
                      <Sparkles className="h-3 w-3" /> {w.qualityScore}% quality
                    </span>
                  )}
                  <StatusBadge status={w.stage} />
                </div>
              </div>
              <WorkflowPipeline current={w.stage} />
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {w.entries.map((e) => (
                  <div key={e.id} className="border border-border rounded-md p-2.5">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold">{e.day} · {e.date}</div>
                      <div className="text-[10px] text-muted-foreground">{e.hours}h</div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{e.tasks}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Feedback */}
      <Section title="Feedback">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
                <Stamp className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">Company supervisor</div>
                <div className="text-[11px] text-muted-foreground">Peter Njoroge · Acme Industries</div>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="rounded-lg bg-muted/40 p-3 text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">Week 8</span>
                  <span className="text-[10px] text-muted-foreground">2d ago</span>
                </div>
                <p className="text-foreground/90 leading-snug">Excellent work on the ETL pipeline. The runbook documentation is thorough.</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">Week 7</span>
                  <span className="text-[10px] text-muted-foreground">1w ago</span>
                </div>
                <p className="text-foreground/90 leading-snug">Good test coverage. Try to add more edge cases next week.</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-success-soft text-success flex items-center justify-center">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">Academic supervisor</div>
                <div className="text-[11px] text-muted-foreground">Dr. J. Mwangi</div>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="rounded-lg bg-muted/40 p-3 text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-success">Week 8</span>
                  <span className="text-[10px] text-muted-foreground">3d ago</span>
                </div>
                <p className="text-foreground/90 leading-snug">Great alignment with course outcomes. Reflect more on lessons learned in your weekly summary.</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 text-sm flex items-start gap-2">
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-muted-foreground italic leading-snug">No new comments on Week 7.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <NewEntryModal open={localOpen} onClose={() => setLocalOpen(false)} onSubmit={addEntry} />
    </AppShell>
  );
}
