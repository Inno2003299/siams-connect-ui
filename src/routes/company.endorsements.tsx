import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge, WorkflowPipeline } from "@/components/ui-kit/StatCard";
import { Check, MessageSquare, X, Sparkles, FileSignature } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/company/endorsements")({
  head: () => ({ meta: [{ title: "Endorsements — SIAMS" }] }),
  component: Endorsements,
});

const ENTRIES = [
  {
    id: "e1",
    name: "Amina Otieno",
    week: "Week 9",
    role: "Data Engineering Intern",
    summary:
      "Built and deployed the ETL job for the customer churn dataset. Wrote tests covering 4 edge cases, deployed to staging, and ran a backfill of 30 days.",
    skills: ["Python", "Airflow", "BigQuery"],
  },
  {
    id: "e2",
    name: "Brian Owino",
    week: "Week 9",
    role: "Backend Intern",
    summary:
      "Implemented JWT refresh-token rotation on the auth service and added rate-limit middleware. Paired with senior on the migration plan.",
    skills: ["Node.js", "Postgres", "Redis"],
  },
];

function Endorsements() {
  const [comment, setComment] = useState<Record<string, string>>({});
  const [done, setDone] = useState<Record<string, "approved" | "rejected" | undefined>>({});

  return (
    <AppShell title="Logbook Endorsements">
      <p className="text-sm text-muted-foreground mb-6">
        Review weekly entries from your interns. Approve or reject and add a digital signature.
      </p>

      <div className="space-y-5">
        {ENTRIES.map((e) => {
          const result = done[e.id];
          return (
            <div key={e.id} className="rounded-xl border border-border bg-card p-5 lg:p-6 shadow-card">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
                    {e.name.split(" ").map((p) => p[0]).join("")}
                  </div>
                  <div>
                    <div className="font-semibold">{e.name}</div>
                    <div className="text-xs text-muted-foreground">{e.week} · {e.role}</div>
                  </div>
                </div>
                <StatusBadge status={result === "approved" ? "Endorsed" : result === "rejected" ? "Rejected" : "Submitted"} />
              </div>

              <div className="mt-5 rounded-lg bg-muted/50 p-4">
                <WorkflowPipeline current={result === "approved" ? "Reviewed" : "Submitted"} />
              </div>

              <p className="mt-5 text-sm text-foreground/90 leading-relaxed">{e.summary}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {e.skills.map((s) => (
                  <span key={s} className="text-[11px] font-medium bg-primary-soft text-primary px-2 py-0.5 rounded-full">
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold text-foreground mb-2">Rate the student</div>
                  <div className="space-y-2">
                    {["Attendance", "Discipline", "Punctuality", "Work quality"].map((cat) => (
                      <div key={cat} className="flex items-center justify-between gap-3">
                        <span className="text-xs text-muted-foreground">{cat}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button
                              key={n}
                              type="button"
                              className="h-6 w-6 rounded text-[11px] font-semibold bg-muted hover:bg-primary-soft hover:text-primary transition-colors"
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-foreground mb-2">Comment</div>
                  <textarea
                    value={comment[e.id] || ""}
                    onChange={(ev) => setComment({ ...comment, [e.id]: ev.target.value })}
                    rows={4}
                    placeholder="Optional feedback for the student…"
                    className="w-full p-3 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/30"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 flex-wrap pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileSignature className="h-4 w-4" />
                  <span>Digital signature: <span className="font-medium text-foreground">Peter Njoroge</span> · {new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-card border border-border text-sm font-medium hover:bg-muted">
                    <MessageSquare className="h-4 w-4" /> Comment
                  </button>
                  <button
                    onClick={() => setDone({ ...done, [e.id]: "rejected" })}
                    className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-destructive-soft text-destructive text-sm font-medium hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4" /> Reject
                  </button>
                  <button
                    onClick={() => setDone({ ...done, [e.id]: "approved" })}
                    className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-success text-success-foreground text-sm font-semibold hover:opacity-90"
                  >
                    <Check className="h-4 w-4" /> Endorse
                  </button>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-muted-foreground inline-flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> AI summary: clear, technical, well-structured entry.
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
