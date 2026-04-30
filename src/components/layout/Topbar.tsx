import { Bell, LogOut, ChevronDown, Zap, FileText, BookOpen, Building2, Upload, Check, Send, Stamp, GraduationCap, Users } from "lucide-react";
import { useRole, ROLE_LABEL, ROLE_USER } from "@/lib/role";
import { useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuickActions, type QuickActionModal } from "@/lib/quickActions";
import { useStudentProfile } from "@/lib/studentProfile";

const NOTIFICATIONS = [
  { id: 1, title: "Week 1 endorsed by Acme Industries", time: "10m ago", unread: true, tone: "success" as const },
  { id: 2, title: "Letter sent to hr@acme-industries.co", time: "1h ago", unread: true, tone: "primary" as const },
  { id: 3, title: "Logbook pending company endorsement", time: "Yesterday", unread: false, tone: "warning" as const },
  { id: 4, title: "Dr. Mwangi reviewed your Week 8 entry", time: "2d ago", unread: false, tone: "primary" as const },
];

const toneDot: Record<"success" | "warning" | "primary", string> = {
  success: "bg-success",
  warning: "bg-warning",
  primary: "bg-primary",
};

export function Topbar({ title }: { title: string }) {
  const { role, setAuthed } = useRole();
  const navigate = useNavigate();
  const user = ROLE_USER[role];
  const { setOpen } = useQuickActions();
  const { profile } = useStudentProfile();
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;
  const avatarPhoto = role === "student" ? profile.photoDataUrl : null;

  const studentItems: { id: QuickActionModal; label: string; icon: typeof FileText; desc: string }[] = [
    { id: "letter", label: "Generate letter", icon: FileText, desc: "Attachment introduction letter" },
    { id: "newEntry", label: "New logbook entry", icon: BookOpen, desc: "Today's tasks & hours" },
    { id: "submitWeek", label: "Submit weekly logbook", icon: Send, desc: "Send week for endorsement" },
    { id: "apply", label: "Apply to company", icon: Building2, desc: "Submit a new application" },
    { id: "upload", label: "Upload document", icon: Upload, desc: "CV, transcript, ID" },
  ];

  const companyItems: { id: QuickActionModal; label: string; icon: typeof FileText; desc: string }[] = [
    { id: "pendingLogbooks", label: "View pending logbooks", icon: Stamp, desc: "Logbooks awaiting your endorsement" },
    { id: "evaluateStudent", label: "Evaluate student", icon: GraduationCap, desc: "Submit final evaluation" },
    { id: "viewStudents", label: "View assigned students", icon: Users, desc: "All interns under your supervision" },
  ];

  const quickItems = role === "student" ? studentItems : role === "company" ? companyItems : [];

  return (
    <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur border-b border-border flex items-center px-4 lg:px-8 gap-2 lg:gap-4">
      {/* Left spacer to keep title centered */}
      <div className="flex-1 min-w-0" aria-hidden />

      {/* Title — center */}
      <h1 className="text-lg font-semibold text-foreground truncate text-center">{title}</h1>

      {/* Right cluster: Quick action → Profile → Notifications (L→R) */}
      <div className="flex-1 min-w-0 flex items-center justify-end gap-2">
        {quickItems.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              aria-label="Quick actions"
            >
              <Zap className="h-4 w-4" />
              <span className="hidden md:inline">Quick action</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-2">
              <DropdownMenuLabel className="px-2 pt-1 pb-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                Quick actions
              </DropdownMenuLabel>
              {quickItems.map((it) => {
                const Icon = it.icon;
                return (
                  <DropdownMenuItem
                    key={it.label}
                    onClick={() => setOpen(it.id)}
                    className="flex items-start gap-3 p-2.5 rounded-md cursor-pointer focus:bg-muted"
                  >
                    <div className="h-8 w-8 rounded-md bg-primary-soft text-primary flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium leading-tight">{it.label}</div>
                      <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">{it.desc}</div>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2.5 pl-1.5 pr-2.5 h-10 rounded-lg hover:bg-muted transition-colors">
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center overflow-hidden ring-2 ring-background">
              {avatarPhoto ? (
                <img src={avatarPhoto} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.initials
              )}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-sm font-medium leading-tight">{user.name}</div>
              <div className="text-[11px] text-muted-foreground leading-tight">{ROLE_LABEL[role]}</div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground hidden lg:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setAuthed(false);
                navigate({ to: "/login" });
              }}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications — rightmost */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="relative h-9 w-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px] text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold flex items-center justify-center ring-2 ring-background">
                {unreadCount}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
              <div className="text-sm font-semibold">Notifications</div>
              <button className="text-[11px] text-primary font-medium hover:underline inline-flex items-center gap-1">
                <Check className="h-3 w-3" /> Mark all read
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {NOTIFICATIONS.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-2.5 px-3 py-2.5 border-b border-border/60 last:border-0 hover:bg-muted/60 cursor-pointer transition-colors ${n.unread ? "bg-muted/30" : ""}`}
                >
                  <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${toneDot[n.tone]}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm leading-snug">{n.title}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-3 py-2 border-t border-border text-center">
              <button className="text-xs text-primary font-medium hover:underline">View all notifications</button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
