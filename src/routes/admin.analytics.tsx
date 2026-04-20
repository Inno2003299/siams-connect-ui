import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "Analytics — SIAMS" }] }),
  component: Analytics,
});

const SUCCESS = [
  { y: "2020", r: 72 }, { y: "2021", r: 78 }, { y: "2022", r: 83 },
  { y: "2023", r: 87 }, { y: "2024", r: 89 }, { y: "2025", r: 91 },
];

const RANK = [
  { c: "Acme", s: 96 }, { c: "Safaricom", s: 91 }, { c: "Twiga", s: 88 },
  { c: "Equity", s: 82 }, { c: "BRCK", s: 78 }, { c: "K. Power", s: 74 },
];

const RISK = [
  { name: "Healthy", value: 312, color: "oklch(0.68 0.16 155)" },
  { name: "Watch", value: 67, color: "oklch(0.78 0.15 70)" },
  { name: "At Risk", value: 33, color: "oklch(0.6 0.22 25)" },
];

function Analytics() {
  return (
    <AppShell title="Analytics">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="mb-4">
            <h3 className="text-sm font-semibold">Placement success rate</h3>
            <p className="text-xs text-muted-foreground">Year-over-year</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SUCCESS}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 255)" />
                <XAxis dataKey="y" stroke="oklch(0.5 0.02 260)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.02 260)" fontSize={12} domain={[60, 100]} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.92 0.01 255)", fontSize: 12 }} />
                <Bar dataKey="r" fill="oklch(0.36 0.14 264)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="mb-4">
            <h3 className="text-sm font-semibold">Student risk analysis</h3>
            <p className="text-xs text-muted-foreground">412 students</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={RISK} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {RISK.map((r) => <Cell key={r.name} fill={r.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.92 0.01 255)", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="mb-4">
          <h3 className="text-sm font-semibold">Company performance ranking</h3>
          <p className="text-xs text-muted-foreground">Composite score from supervisor reviews and student feedback</p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={RANK} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 255)" />
              <XAxis type="number" stroke="oklch(0.5 0.02 260)" fontSize={12} domain={[0, 100]} />
              <YAxis type="category" dataKey="c" stroke="oklch(0.5 0.02 260)" fontSize={12} width={80} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.92 0.01 255)", fontSize: 12 }} />
              <Bar dataKey="s" fill="oklch(0.68 0.16 155)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppShell>
  );
}
