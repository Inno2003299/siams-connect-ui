import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Briefcase, GraduationCap, ShieldCheck, UserSquare2 } from "lucide-react";
import { useRole, type Role, ROLE_LABEL } from "@/lib/role";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — SIAMS" },
      { name: "description", content: "Sign in to the Smart Industrial Attachment Management System." },
    ],
  }),
  component: LoginPage,
});

const ROLES: { id: Role; icon: typeof GraduationCap; desc: string }[] = [
  { id: "student", icon: GraduationCap, desc: "Apply, log progress" },
  { id: "supervisor", icon: UserSquare2, desc: "Review & evaluate" },
  { id: "admin", icon: ShieldCheck, desc: "Manage the program" },
];

function LoginPage() {
  const { role, setRole, setAuthed, isAuthed } = useRole();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  if (isAuthed) return <Navigate to={`/${role}` as "/student"} />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthed(true);
    navigate({ to: `/${role}` as "/student" });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-10 bg-background overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-[420px] w-[420px] rounded-full bg-success/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-lg font-semibold leading-tight">SIAMS</div>
            <div className="text-xs text-muted-foreground leading-tight">Smart Industrial Attachment</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-elevated p-8">
          <h1 className="text-xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to continue to your dashboard.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {ROLES.map((r) => {
              const active = role === r.id;
              const Icon = r.icon;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    active
                      ? "border-primary bg-primary-soft ring-2 ring-primary/20"
                      : "border-border hover:border-primary/40 hover:bg-muted"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                  <div className={`mt-2 text-xs font-semibold ${active ? "text-primary" : "text-foreground"}`}>
                    {ROLE_LABEL[r.id]}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{r.desc}</div>
                </button>
              );
            })}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@uni.edu"
                className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-card focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Password</label>
              <input
                type="password"
                required
                defaultValue="demo1234"
                className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-card focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
            >
              Sign in as {ROLE_LABEL[role]}
            </button>
          </form>

          <p className="mt-5 text-[11px] text-center text-muted-foreground">
            Demo mode — any email works. Pick a role to explore that panel.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} SIAMS · University Platform
        </p>
      </div>
    </div>
  );
}
