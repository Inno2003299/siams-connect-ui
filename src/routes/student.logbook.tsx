import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge, WorkflowPipeline, Section } from "@/components/ui-kit/StatCard";
import { useState } from "react";
import { Calendar, Check } from "lucide-react";

export const Route = createFileRoute("/student/logbook")({
  head: () => ({ meta: [{ title: "Logbook — SIAMS" }] }),
  component: Logbook,
});

const HISTORY = [
  { week: "Week 8", date: "Apr 14 – Apr 20", s: "Approved" as const, snippet: "Built and deployed the ETL job for the customer churn dataset." },
  { week: "Week 7", date: "Apr 07 – Apr 13", s: "Approved" as const, snippet: "Pair-programmed on the recommendation service. Wrote 12 unit tests." },
  { week: "Week 6", date: "Mar 31 – Apr 06", s: "Pending" as const, snippet: "Onboarded onto the data team's repo. Set up local environment." },
];

function Logbook() {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <AppShell title="Weekly Logbook">
      <Section title="Week 9 workflow">
        <div className="rounded-xl border border-border bg-card p-5 lg:p-6 shadow-card">
          <WorkflowPipeline current={submitted ? "Submitted" : "Draft"} />
          <p className="mt-4 text-xs text-muted-foreground text-center">
            Your entry flows from <span className="font-medium text-foreground">Draft</span> → submitted to your{" "}
            <span className="font-medium text-foreground">Company Supervisor</span> → endorsed → reviewed by your{" "}
            <span className="font-medium text-foreground">Academic Supervisor</span> → finalized.
          </p>
        </div>
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-semibold">Week 9 entry</h2>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Apr 21 – Apr 27 · due Sunday
              </p>
            </div>
            <span className="text-[11px] font-medium text-warning bg-warning-soft px-2 py-1 rounded-full">Not submitted</span>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe what you worked on this week, what you learned, and any blockers…"
            rows={10}
            className="mt-5 w-full p-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring text-sm resize-y"
          />

          <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
            <div className="text-xs text-muted-foreground">{text.length} characters</div>
            <div className="flex items-center gap-2">
              <button className="h-10 px-4 rounded-lg border border-border bg-card text-sm font-medium hover:bg-muted">
                Save draft
              </button>
              <button
                onClick={() => { setSubmitted(true); setText(""); }}
                disabled={text.trim().length < 5}
                className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit entry
              </button>
            </div>
          </div>

          {submitted && (
            <div className="mt-4 flex items-center gap-2 text-sm text-success bg-success-soft px-3 py-2 rounded-lg">
              <Check className="h-4 w-4" /> Submitted! Your supervisor will review shortly.
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="text-sm font-semibold mb-1">Submission history</h3>
          <p className="text-xs text-muted-foreground mb-4">Past 8 weeks</p>
          <ul className="space-y-3">
            {HISTORY.map((h) => (
              <li key={h.week} className="border border-border rounded-lg p-3 hover:bg-muted/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{h.week}</div>
                  <StatusBadge status={h.s} />
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{h.date}</div>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{h.snippet}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
