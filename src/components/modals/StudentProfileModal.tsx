import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Phone, GraduationCap, Building2, BookOpen } from "lucide-react";
import { StatusBadge } from "@/components/ui-kit/StatCard";
import type { AssignedStudent } from "@/lib/companyData";
import { WEEK_LOGS } from "@/lib/companyData";

export function StudentProfileModal({
  student,
  open,
  onClose,
  onOpenLog,
}: {
  student: AssignedStudent | null;
  open: boolean;
  onClose: () => void;
  onOpenLog?: (logId: string) => void;
}) {
  if (!student) return null;
  const logs = WEEK_LOGS.filter((l) => l.studentId === student.id);
  const avgHours =
    logs.length > 0
      ? Math.round(
          logs.reduce((a, l) => a + l.daily.reduce((x, d) => x + d.hours, 0), 0) / logs.length
        )
      : 0;
  const progress = Math.round((student.weeksCompleted / student.totalWeeks) * 100);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
              {student.initials}
            </div>
            <div>
              <div className="text-base font-semibold">{student.name}</div>
              <div className="text-xs text-muted-foreground font-normal">{student.role}</div>
            </div>
            <div className="ml-auto">
              <StatusBadge status={student.status} />
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-3">
          {/* Contact + program */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 rounded-md border border-border p-2.5">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{student.email}</span>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-border p-2.5">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{student.phone}</span>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-border p-2.5">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span>{student.program}</span>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-border p-2.5">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>{student.institution}</span>
            </div>
          </div>

          {/* Smart tags */}
          {student.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {student.tags.map((t) => (
                <span
                  key={t}
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    t === "Consistent performer"
                      ? "bg-success-soft text-success"
                      : t === "Late submission"
                        ? "bg-warning-soft text-warning"
                        : "bg-destructive-soft text-destructive"
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Performance summary */}
          <div className="rounded-lg border border-border p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Performance summary
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-semibold text-foreground">
                  {student.weeksCompleted}/{student.totalWeeks}
                </div>
                <div className="text-[11px] text-muted-foreground">Weeks completed</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-foreground">{avgHours}h</div>
                <div className="text-[11px] text-muted-foreground">Avg. hours / week</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-foreground">{progress}%</div>
                <div className="text-[11px] text-muted-foreground">Progress</div>
              </div>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Logbook history */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Logbook history
            </div>
            {logs.length === 0 ? (
              <div className="text-sm text-muted-foreground py-4 text-center border border-dashed border-border rounded-md">
                No logbook entries yet.
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => onOpenLog?.(l.id)}
                    className="w-full text-left flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted transition-colors"
                  >
                    <div className="h-8 w-8 rounded-md bg-primary-soft text-primary flex items-center justify-center">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">
                        Week {l.week} · {l.range}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {l.summary}
                      </div>
                    </div>
                    <StatusBadge status={l.status} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
