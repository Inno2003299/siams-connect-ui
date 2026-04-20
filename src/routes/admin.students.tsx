import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui-kit/StatCard";
import { Search } from "lucide-react";

export const Route = createFileRoute("/admin/students")({
  head: () => ({ meta: [{ title: "Student Management — SIAMS" }] }),
  component: AdminStudents,
});

const STUDENTS = [
  { name: "Amina Otieno", id: "SCT-2104", program: "Computer Science", company: "Acme Industries", s: "Active" as const },
  { name: "Brian Owino", id: "SCT-2118", program: "Software Eng.", company: "Safaricom PLC", s: "At Risk" as const },
  { name: "Daniel Kiptoo", id: "SCT-2132", program: "Data Science", company: "Twiga Foods", s: "Active" as const },
  { name: "Faith Wanjiru", id: "SCT-2147", program: "Information Tech", company: "Equity Bank", s: "At Risk" as const },
  { name: "Grace Mutiso", id: "SCT-2156", program: "Computer Science", company: "BRCK", s: "Active" as const },
  { name: "Hassan Ali", id: "SCT-2168", program: "Software Eng.", company: "Acme Industries", s: "Completed" as const },
  { name: "Irene Cheptoo", id: "SCT-2174", program: "Data Science", company: "Safaricom PLC", s: "Active" as const },
];

function AdminStudents() {
  return (
    <AppShell title="Student Management">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input placeholder="Search students by name or ID…" className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
        </div>
        <div className="flex items-center gap-2">
          {(["All", "Active", "At Risk", "Completed"] as const).map((t, i) => (
            <button key={t} className={`h-10 px-3.5 rounded-lg text-sm font-medium transition-colors ${i === 0 ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-muted"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-5 py-3">Student</th>
              <th className="text-left font-medium px-5 py-3 hidden md:table-cell">Program</th>
              <th className="text-left font-medium px-5 py-3 hidden sm:table-cell">Placement</th>
              <th className="text-left font-medium px-5 py-3">Status</th>
              <th className="text-right font-medium px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {STUDENTS.map((s) => (
              <tr key={s.id} className="hover:bg-muted/30">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                      {s.name.split(" ").map((p) => p[0]).join("")}
                    </div>
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground hidden md:table-cell">{s.program}</td>
                <td className="px-5 py-3.5 text-muted-foreground hidden sm:table-cell">{s.company}</td>
                <td className="px-5 py-3.5"><StatusBadge status={s.s} /></td>
                <td className="px-5 py-3.5 text-right">
                  <button className="text-xs font-medium text-primary hover:underline">View profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
