import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/supervisor/evaluation")({
  head: () => ({ meta: [{ title: "Evaluation — SIAMS" }] }),
  component: Evaluation,
});

const STUDENTS = [
  { name: "Amina Otieno", company: "Acme Industries", grade: "A−", score: 88 },
  { name: "Brian Owino", company: "Safaricom PLC", grade: "C+", score: 62 },
  { name: "Daniel Kiptoo", company: "Twiga Foods", grade: "A", score: 92 },
  { name: "Faith Wanjiru", company: "Equity Bank", grade: "C", score: 58 },
  { name: "Grace Mutiso", company: "BRCK", grade: "B+", score: 81 },
];

const TREND = [
  { w: "W1", avg: 68 }, { w: "W2", avg: 71 }, { w: "W3", avg: 74 },
  { w: "W4", avg: 73 }, { w: "W5", avg: 76 }, { w: "W6", avg: 79 },
  { w: "W7", avg: 81 }, { w: "W8", avg: 84 },
];

function Evaluation() {
  return (
    <AppShell title="Evaluation">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold">Cohort performance trend</h3>
              <p className="text-xs text-muted-foreground">Average score across 24 students</p>
            </div>
            <div className="text-2xl font-semibold text-success">+16</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 255)" />
                <XAxis dataKey="w" stroke="oklch(0.5 0.02 260)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.02 260)" fontSize={12} domain={[50, 100]} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.92 0.01 255)", fontSize: 12 }} />
                <Line type="monotone" dataKey="avg" stroke="oklch(0.36 0.14 264)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="text-sm font-semibold mb-4">Grade distribution</h3>
          <div className="space-y-3">
            {[{ g: "A", n: 6, c: "bg-success" }, { g: "B", n: 9, c: "bg-primary" }, { g: "C", n: 7, c: "bg-warning" }, { g: "D", n: 2, c: "bg-destructive" }].map((b) => (
              <div key={b.g}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium">Grade {b.g}</span>
                  <span className="text-muted-foreground">{b.n} students</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full ${b.c} rounded-full transition-all`} style={{ width: `${(b.n / 24) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold">Grade students</h3>
          <button className="text-xs font-medium text-primary hover:underline">Export CSV</button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-5 py-3">Student</th>
              <th className="text-left font-medium px-5 py-3 hidden sm:table-cell">Company</th>
              <th className="text-left font-medium px-5 py-3">Score</th>
              <th className="text-left font-medium px-5 py-3">Grade</th>
              <th className="text-right font-medium px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {STUDENTS.map((s) => (
              <tr key={s.name} className="hover:bg-muted/30">
                <td className="px-5 py-3.5 font-medium">{s.name}</td>
                <td className="px-5 py-3.5 text-muted-foreground hidden sm:table-cell">{s.company}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${s.score >= 80 ? "bg-success" : s.score >= 65 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${s.score}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">{s.score}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 font-semibold">{s.grade}</td>
                <td className="px-5 py-3.5 text-right">
                  <button className="text-xs font-medium text-primary hover:underline">Edit grade</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
