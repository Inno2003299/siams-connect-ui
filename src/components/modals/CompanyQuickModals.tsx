import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Stamp, Users } from "lucide-react";
import { ASSIGNED_STUDENTS, WEEK_LOGS } from "@/lib/companyData";
import { StatusBadge } from "@/components/ui-kit/StatCard";

export function PendingLogbooksModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const pending = WEEK_LOGS.filter((l) => l.status === "Pending");

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stamp className="h-5 w-5 text-primary" /> Pending logbooks ({pending.length})
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-2">
          {pending.map((l) => {
            const s = ASSIGNED_STUDENTS.find((x) => x.id === l.studentId);
            return (
              <div
                key={l.id}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold flex items-center justify-center">
                  {s?.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{s?.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    Week {l.week} · {l.submittedAt}
                  </div>
                </div>
                <StatusBadge status={l.status} />
              </div>
            );
          })}
        </div>
        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              onClose();
              navigate({ to: "/company/endorsements" });
            }}
          >
            Open endorsements
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ViewStudentsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> Assigned students ({ASSIGNED_STUDENTS.length})
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-2 max-h-[50vh] overflow-y-auto">
          {ASSIGNED_STUDENTS.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 rounded-lg border border-border p-3"
            >
              <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                {s.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{s.name}</div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {s.role} · {s.institution}
                </div>
              </div>
              <StatusBadge status={s.status} />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              onClose();
              navigate({ to: "/company/students" });
            }}
          >
            Open students page
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
