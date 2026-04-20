import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Sparkles, MapPin, Building2 } from "lucide-react";

export const Route = createFileRoute("/student/companies")({
  head: () => ({ meta: [{ title: "Companies — SIAMS" }] }),
  component: Companies,
});

const COMPANIES = [
  { name: "Acme Industries", match: 96, location: "Nairobi", desc: "Manufacturing & robotics. Strong ML attachment program with rotation across 4 teams." },
  { name: "Safaricom PLC", match: 92, location: "Westlands", desc: "Telecom & fintech. Real product work with mentorship from senior engineers." },
  { name: "Twiga Foods", match: 88, location: "Industrial Area", desc: "Logistics platform. Backend, data, and ops attachment tracks available." },
  { name: "Kenya Power", match: 74, location: "Parklands", desc: "Utilities. Engineering placements across distribution and grid analytics." },
  { name: "Equity Bank", match: 71, location: "Upper Hill", desc: "Banking. Software, data, and risk attachment cohorts each semester." },
  { name: "BRCK", match: 65, location: "Karen", desc: "Hardware & connectivity. Hands-on embedded and IoT placements." },
];

function Companies() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        {COMPANIES.map((c) => {
          const top = c.match >= 90;
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
                <div className={`shrink-0 text-right`}>
                  <div className={`text-lg font-semibold ${top ? "text-success" : "text-foreground"}`}>{c.match}%</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">match</div>
                </div>
              </div>

              <p className="mt-4 text-sm text-muted-foreground line-clamp-2">{c.desc}</p>

              <div className="mt-5 flex items-center justify-between">
                {top ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success bg-success-soft px-2 py-0.5 rounded-full">
                    <Sparkles className="h-3 w-3" /> Top match
                  </span>
                ) : (
                  <span className="text-[11px] text-muted-foreground">Good fit</span>
                )}
                <button className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  Apply
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
