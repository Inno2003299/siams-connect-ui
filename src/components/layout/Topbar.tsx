import { Bell, LogOut, Search, ChevronDown } from "lucide-react";
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

export function Topbar({ title }: { title: string }) {
  const { role, setAuthed } = useRole();
  const navigate = useNavigate();
  const user = ROLE_USER[role];

  return (
    <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur border-b border-border flex items-center px-4 lg:px-8 gap-4">
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-semibold text-foreground truncate">{title}</h1>
      </div>

      <div className="hidden md:flex relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search..."
          className="w-full h-9 pl-9 pr-3 rounded-lg bg-muted border border-transparent focus:bg-card focus:border-border focus:outline-none focus:ring-2 focus:ring-ring/20 text-sm"
        />
      </div>

      <button className="relative h-9 w-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
        <Bell className="h-4.5 w-4.5 text-muted-foreground" />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-warning ring-2 ring-background" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2.5 pl-2 pr-2.5 h-10 rounded-lg hover:bg-muted transition-colors">
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
            {user.initials}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-medium leading-tight">{user.name}</div>
            <div className="text-[11px] text-muted-foreground leading-tight">{ROLE_LABEL[role]}</div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
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
    </header>
  );
}
