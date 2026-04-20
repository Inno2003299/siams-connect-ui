import { Link, useLocation } from "@tanstack/react-router";
import { useRole, type Role } from "@/lib/role";
import {
  LayoutDashboard,
  Building2,
  FileText,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Users,
  BarChart3,
  Briefcase,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = { to: string; label: string; icon: LucideIcon };

const NAV: Record<Role, NavItem[]> = {
  student: [
    { to: "/student", label: "Dashboard", icon: LayoutDashboard },
    { to: "/student/companies", label: "Companies", icon: Building2 },
    { to: "/student/applications", label: "Applications", icon: FileText },
    { to: "/student/logbook", label: "Logbook", icon: BookOpen },
  ],
  supervisor: [
    { to: "/supervisor", label: "Dashboard", icon: LayoutDashboard },
    { to: "/supervisor/logbooks", label: "Logbook Review", icon: ClipboardCheck },
    { to: "/supervisor/evaluation", label: "Evaluation", icon: GraduationCap },
  ],
  admin: [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/companies", label: "Companies", icon: Building2 },
    { to: "/admin/students", label: "Students", icon: Users },
    { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ],
};

export function Sidebar() {
  const { role } = useRole();
  const { pathname } = useLocation();
  const items = NAV[role];

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 border-r border-sidebar-border bg-sidebar flex-col">
      <div className="h-16 px-6 flex items-center gap-2.5 border-b border-sidebar-border">
        <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
          <Briefcase className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground leading-tight">SIAMS</div>
          <div className="text-[11px] text-sidebar-muted leading-tight">Attachment System</div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <div className="px-3 pt-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-muted">
          {role === "student" ? "Student" : role === "supervisor" ? "Supervisor" : "Admin"}
        </div>
        {items.map((it) => {
          const active = pathname === it.to || (it.to !== `/${role}` && pathname.startsWith(it.to));
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-active text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-active/60"
              }`}
            >
              <Icon className={`h-4.5 w-4.5 ${active ? "text-primary" : "text-sidebar-muted group-hover:text-foreground"}`} strokeWidth={2} />
              {it.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="rounded-lg bg-primary-soft p-3">
          <div className="text-xs font-semibold text-primary">Need help?</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            Visit the help center for guides on using SIAMS.
          </div>
        </div>
      </div>
    </aside>
  );
}
