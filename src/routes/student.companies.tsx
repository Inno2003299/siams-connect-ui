import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Sparkles, MapPin, Building2, Search, Check, Clock } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/student/companies")({
  head: () => ({ meta: [{ title: "Companies — SIAMS" }] }),
  component: Companies,
});

type AppStatus = "Pending" | "Approved" | "Rejected" | null;

const COMPANIES: { name: string; match: number; location: string; desc: string; initial: AppStatus }[] = [
  { name: "Acme Industries", match: 96, location: "Nairobi", desc: "Manufacturing & robotics. Strong ML attachment program with rotation across 4 teams.", initial: "Approved" },
  { name: "Safaricom PLC", match: 92, location: "Westlands", desc: "Telecom & fintech. Real product work with mentorship from senior engineers.", initial: "Pending" },
  { name: "Twiga Foods", match: 88, location: "Industrial Area", desc: "Logistics platform. Backend, data, and ops attachment tracks available.", initial: "Pending" },
  { name: "Kenya Power", match: 74, location: "Parklands", desc: "Utilities. Engineering placements across distribution and grid analytics.", initial: "Rejected" },
  { name: "Equity Bank", match: 71, location: "Upper Hill", desc: "Banking. Software, data, and risk attachment cohorts each semester.", initial: null },
  { name: "BRCK", match: 65, location: "Karen", desc: "Hardware & connectivity. Hands-on embedded and IoT placements.", initial: null },
];

const statusBadge: Record<Exclude<AppStatus, null>, string> = {
  Pending: "bg-warning-soft text-warning",
  Approved: "bg-success-soft text-success",
  Rejected: "bg-destructive-soft text-destructive",
};

function Companies() {
  const [query, setQuery] = useState("");
  const [statuses, setStatuses] = useState<Record<string, AppStatus>>(
    () => Object.fromEntries(COMPANIES.map((c) => [c.name, c.initial])),
  );
  const [justApplied, setJustApplied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMPANIES;
    return COMPANIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q),
    );
  }, [query]);

  const apply = (name: string) => {
    setStatuses((s) => ({ ...s, [name]: "Pending" }));
    setJustApplied(name);
    setTimeout(() => setJustApplied(null), 1600);
  };

  return (
    <AppShell title="Companies">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold">Recommended Companies</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Ranked by AI match based on your skills, GPA, and preferences.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-soft text-primary text-xs font-medium">
          <Sparkles className="h-3.5 w-3.5" />
          AI ranked
        </div>
      </div>

      <div className="mt-5 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search companies, locations, or skills…"
          className="w-full h-10 pl-9 pr-3 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-ring/30 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        {filtered.map((c) => {
          const top = c.match >= 90;
          const status = statuses[c.name];
          const applied = !!status;
          return (
            <div
              key={c.name}
              className={`group rounded-xl border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated ${
                top ? "border-primary/30 ring-1 ring-primary/10" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-11 w-11 shrink-0 rounded-lg bg-primary-soft flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{c.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" /> {c.location}
                    </div>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className={`text-lg font-semibold ${top ? "text-success" : "text-foreground"}`}>{c.match}%</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">match</div>
                </div>
              </div>

              <p className="mt-4 text-sm text-muted-foreground line-clamp-2">{c.desc}</p>

              <div className="mt-5 flex items-center justify-between">
                {status ? (
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusBadge[status]}`}>
                    {status === "Pending" && <Clock className="h-3 w-3" />}
                    {status === "Approved" && <Check className="h-3 w-3" />}
                    {status}
                  </span>
                ) : top ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success bg-success-soft px-2 py-0.5 rounded-full">
                    <Sparkles className="h-3 w-3" /> Top match
                  </span>
                ) : (
                  <span className="text-[11px] text-muted-foreground">Good fit</span>
                )}
                <button
                  onClick={() => !applied && apply(c.name)}
                  disabled={applied}
                  className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {justApplied === c.name ? "Applied ✓" : applied ? "Applied" : "Apply"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 text-center text-sm text-muted-foreground">No companies match your search.</div>
      )}
    </AppShell>
  );
}
