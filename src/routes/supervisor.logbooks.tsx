import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui-kit/StatCard";
import { Check, MessageSquare, Flag, Sparkles } from "lucide-react";

export const Route = createFileRoute("/supervisor/logbooks")({
  head: () => ({ meta: [{ title: "Logbook Review — SIAMS" }] }),
  component: LogbookReview,
});

const ENTRIES = [
  {
    name: "Amina Otieno",
    week: "Week 8",
    company: "Acme Industries",
    ai: "Good" as const,
    preview: "Built and deployed the ETL job for the customer churn dataset. Wrote tests covering 4 edge cases, deployed to staging, and ran a backfill of 30 days.",
  },
  {
    name: "Brian Owino",
    week: "Week 7",
    company: "Safaricom PLC",
    ai: "Needs Review" as const,
    preview: "Did some work on the project. Helped the team. Met with my manager.",
  },
  {
    name: "Daniel Kiptoo",
    week: "Week 8",
    company: "Twiga Foods",
    ai: "Good" as const,
    preview: "Completed the dashboard refactor — reduced load time from 2.4s to 0.8s. Documented the new state pattern for the team.",
  },
];

function LogbookReview() {
  return (
    <AppShell title="Logbook Review">
      <p className="text-sm text-muted-foreground mb-6">11 submissions awaiting your review.</p>

      <div className="space-y-4">
        {ENTRIES.map((e) => (
          <div key={e.name + e.week} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
                  {e.name.split(" ").map((p) => p[0]).join("")}
                </div>
                <div>
                  <div className="font-semibold">{e.name}</div>
                  <div className="text-xs text-muted-foreground">{e.week} · {e.company}</div>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground mr-1">AI quality</span>
                <StatusBadge status={e.ai} />
              </div>
            </div>

            <p className="mt-4 text-sm text-foreground/90 leading-relaxed">{e.preview}</p>

            <div className="mt-5 flex items-center gap-2 flex-wrap">
              <button className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-success text-success-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                <Check className="h-4 w-4" /> Approve
              </button>
              <button className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-card border border-border text-sm font-medium hover:bg-muted transition-colors">
                <MessageSquare className="h-4 w-4" /> Comment
              </button>
              <button className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-destructive-soft text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors">
                <Flag className="h-4 w-4" /> Flag
              </button>
              <button className="ml-auto text-xs font-medium text-primary hover:underline">View full entry →</button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
