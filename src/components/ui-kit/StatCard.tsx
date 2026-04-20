import type { LucideIcon } from "lucide-react";

type Tone = "primary" | "success" | "warning" | "danger";

const toneBg: Record<Tone, string> = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-destructive-soft text-destructive",
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: Tone;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-muted-foreground font-medium">{label}</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</div>
          {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
        </div>
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${toneBg[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mt-8 first:mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function StatusBadge({ status }: { status: "Pending" | "Approved" | "Rejected" | "Active" | "Completed" | "At Risk" | "Good" | "Needs Review" }) {
  const map: Record<string, string> = {
    Pending: "bg-warning-soft text-warning",
    Approved: "bg-success-soft text-success",
    Rejected: "bg-destructive-soft text-destructive",
    Active: "bg-primary-soft text-primary",
    Completed: "bg-success-soft text-success",
    "At Risk": "bg-destructive-soft text-destructive",
    Good: "bg-success-soft text-success",
    "Needs Review": "bg-warning-soft text-warning",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
