import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard, Section } from "@/components/ui-kit/StatCard";
import { Users, Building2, Briefcase, TrendingUp } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from "recharts";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — SIAMS" }] }),
  component: AdminDashboard,
});

const PLACEMENTS = [
  { m: "Jan", n: 32 }, { m: "Feb", n: 41 }, { m: "Mar", n: 58 },
  { m: "Apr", n: 64 }, { m: "May", n: 72 }, { m: "Jun", n: 81 },
];

const COMPANIES = [
  { c: "Acme", v: 24 }, { c: "Safaricom", v: 19 }, { c: "Twiga", v: 14 },
  { c: "Equity", v: 11 }, { c: "Kenya Power", v: 8 }, { c: "BRCK", v: 6 },
];

function AdminDashboard() {
  return (
    <AppShell title="Admin Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value="412" hint="+18 this month" icon={Users} tone="primary" />
        <StatCard label="Partner Companies" value="86" hint="6 onboarding" icon={Building2} tone="success" />
        <StatCard label="Active Attachments" value="298" hint="72% placement" icon={Briefcase} tone="primary" />
        <StatCard label="Success Rate" value="91%" hint="+4% YoY" icon={TrendingUp} tone="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold">Placements over time</h3>
              <p className="text-xs text-muted-foreground">Monthly student placements</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PLACEMENTS}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.36 0.14 264)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.36 0.14 264)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 255)" />
                <XAxis dataKey="m" stroke="oklch(0.5 0.02 260)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.02 260)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.92 0.01 255)", fontSize: 12 }} />
                <Area type="monotone" dataKey="n" stroke="oklch(0.36 0.14 264)" strokeWidth={2.5} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="text-sm font-semibold mb-1">Top hiring companies</h3>
          <p className="text-xs text-muted-foreground mb-4">By active attachments</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COMPANIES} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="c" stroke="oklch(0.5 0.02 260)" fontSize={11} width={70} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.92 0.01 255)", fontSize: 12 }} />
                <Bar dataKey="v" fill="oklch(0.36 0.14 264)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <Section title="Recent system activity">
        <div className="rounded-xl border border-border bg-card divide-y divide-border shadow-card">
          {[
            { t: "New company 'Twiga Foods' added", w: "10m ago", tone: "text-success" },
            { t: "23 logbooks approved by Dr. Mwangi", w: "1h ago", tone: "text-primary" },
            { t: "Risk alert: 3 students flagged", w: "3h ago", tone: "text-destructive" },
            { t: "Cohort 2025-A reached 80% placement", w: "1d ago", tone: "text-success" },
          ].map((row) => (
            <div key={row.t} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full ${row.tone.replace("text-", "bg-")}`} />
                <div className="text-sm font-medium">{row.t}</div>
              </div>
              <span className="text-xs text-muted-foreground">{row.w}</span>
            </div>
          ))}
        </div>
      </Section>
    </AppShell>
  );
}
