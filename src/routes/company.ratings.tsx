import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Section } from "@/components/ui-kit/StatCard";
import { Star } from "lucide-react";

export const Route = createFileRoute("/company/ratings")({
  head: () => ({ meta: [{ title: "Student Ratings — SIAMS" }] }),
  component: Ratings,
});

const STUDENTS = [
  { name: "Amina Otieno", role: "Data Eng Intern", scores: { Attendance: 5, Discipline: 5, Punctuality: 4, "Work quality": 5 } },
  { name: "Brian Owino", role: "Backend Intern", scores: { Attendance: 3, Discipline: 4, Punctuality: 3, "Work quality": 4 } },
  { name: "Faith Wanjiru", role: "QA Intern", scores: { Attendance: 4, Discipline: 5, Punctuality: 5, "Work quality": 4 } },
  { name: "Daniel Kiptoo", role: "Mobile Intern", scores: { Attendance: 5, Discipline: 4, Punctuality: 4, "Work quality": 4 } },
];

function StarRow({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-3.5 w-3.5 ${n <= value ? "fill-warning text-warning" : "text-border"}`}
        />
      ))}
    </div>
  );
}

function Ratings() {
  return (
    <AppShell title="Student Ratings">
      <Section title="Performance summary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STUDENTS.map((s) => {
            const avg = (Object.values(s.scores).reduce((a, b) => a + b, 0) / 4).toFixed(1);
            return (
              <div key={s.name} className="rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold text-primary">{avg}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">avg / 5</div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {Object.entries(s.scores).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{k}</span>
                      <StarRow value={v} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </AppShell>
  );
}
