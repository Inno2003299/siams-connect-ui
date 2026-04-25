import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Section } from "@/components/ui-kit/StatCard";
import { useState } from "react";
import { ASSIGNED_STUDENTS, type AssignedStudent } from "@/lib/companyData";
import { EvaluateStudentModal } from "@/components/modals/EvaluateStudentModal";
import { GraduationCap, Plus, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/company/evaluations")({
  head: () => ({ meta: [{ title: "Evaluations — SIAMS" }] }),
  component: Evaluations,
});

const COMPLETED = [
  {
    id: "ev1",
    student: "Faith Wanjiru",
    overall: 5,
    recommendation: "Highly recommended for full-time hire",
    date: "Apr 18, 2025",
  },
];

function Evaluations() {
  const [pre, setPre] = useState<AssignedStudent | null>(null);
  const [open, setOpen] = useState(false);

  const pending = ASSIGNED_STUDENTS.filter(
    (s) => !COMPLETED.some((c) => c.student === s.name)
  );

  const launch = (s: AssignedStudent | null) => {
    setPre(s);
    setOpen(true);
  };

  return (
    <AppShell title="Final Evaluations">
      <p className="text-sm text-muted-foreground mb-6">
        Submit end-of-attachment evaluations. Each evaluation is digitally signed and shared with
        the academic supervisor.
      </p>

      <Section
        title="Awaiting evaluation"
        action={
          <button
            onClick={() => launch(null)}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> New evaluation
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pending.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-border bg-card p-5 shadow-card flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                {s.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{s.name}</div>
                <div className="text-xs text-muted-foreground truncate">{s.role}</div>
              </div>
              <button
                onClick={() => launch(s)}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary-soft text-primary text-xs font-semibold hover:bg-primary/10"
              >
                <GraduationCap className="h-3.5 w-3.5" /> Evaluate
              </button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Completed evaluations">
        <div className="rounded-xl border border-border bg-card divide-y divide-border shadow-card">
          {COMPLETED.map((c) => (
            <div key={c.id} className="flex items-center gap-4 p-4">
              <div className="h-9 w-9 rounded-full bg-success-soft text-success flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{c.student}</div>
                <div className="text-[11px] text-muted-foreground">
                  {c.recommendation} · Overall {c.overall}/5
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{c.date}</div>
            </div>
          ))}
        </div>
      </Section>

      <EvaluateStudentModal open={open} onClose={() => setOpen(false)} preselect={pre} />
    </AppShell>
  );
}
