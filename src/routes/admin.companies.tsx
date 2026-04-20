import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Building2, Plus, Star, Pencil } from "lucide-react";

export const Route = createFileRoute("/admin/companies")({
  head: () => ({ meta: [{ title: "Company Management — SIAMS" }] }),
  component: AdminCompanies,
});

const COMPANIES = [
  { name: "Acme Industries", sector: "Manufacturing", slots: 24, rating: 4.8, perf: 96 },
  { name: "Safaricom PLC", sector: "Telecom", slots: 19, rating: 4.6, perf: 91 },
  { name: "Twiga Foods", sector: "Logistics", slots: 14, rating: 4.5, perf: 88 },
  { name: "Equity Bank", sector: "Finance", slots: 11, rating: 4.3, perf: 82 },
  { name: "Kenya Power", sector: "Utilities", slots: 8, rating: 3.9, perf: 74 },
  { name: "BRCK", sector: "Hardware", slots: 6, rating: 4.1, perf: 78 },
];

function AdminCompanies() {
  return (
    <AppShell title="Company Management">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <p className="text-sm text-muted-foreground">86 partner companies. Track performance and add new partners.</p>
        <button className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add company
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {COMPANIES.map((c) => (
          <div key={c.name} className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-elevated transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-11 w-11 rounded-lg bg-primary-soft flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.sector}</div>
                </div>
              </div>
              <button className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">
                <Pencil className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Slots</div>
                <div className="mt-1 text-lg font-semibold">{c.slots}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Rating</div>
                <div className="mt-1 text-lg font-semibold inline-flex items-center gap-1">
                  {c.rating} <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Score</div>
                <div className={`mt-1 text-lg font-semibold ${c.perf >= 90 ? "text-success" : c.perf >= 80 ? "text-foreground" : "text-warning"}`}>{c.perf}</div>
              </div>
            </div>

            <div className="mt-4 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full ${c.perf >= 90 ? "bg-success" : c.perf >= 80 ? "bg-primary" : "bg-warning"}`} style={{ width: `${c.perf}%` }} />
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
