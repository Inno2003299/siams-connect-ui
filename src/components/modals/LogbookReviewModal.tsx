import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X, FileSignature, Sparkles, Paperclip, Star } from "lucide-react";
import { useEffect, useState } from "react";
import type { WeekLog } from "@/lib/companyData";
import { ASSIGNED_STUDENTS } from "@/lib/companyData";
import { useRole, ROLE_USER } from "@/lib/role";

const RATING_CATS = ["Attendance", "Discipline", "Punctuality", "Work quality"] as const;
type RatingCat = typeof RATING_CATS[number];

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="p-0.5 transition-transform hover:scale-110"
          aria-label={`Rate ${n}`}
        >
          <Star
            className={`h-5 w-5 ${
              n <= value ? "fill-warning text-warning" : "text-border"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function LogbookReviewModal({
  log,
  open,
  onClose,
  onDecision,
}: {
  log: WeekLog | null;
  open: boolean;
  onClose: () => void;
  onDecision?: (id: string, decision: "Endorsed" | "Rejected") => void;
}) {
  const { role } = useRole();
  const supervisor = ROLE_USER[role];
  const [comment, setComment] = useState("");
  const [ratings, setRatings] = useState<Record<RatingCat, number>>({
    Attendance: 0,
    Discipline: 0,
    Punctuality: 0,
    "Work quality": 0,
  });
  const [done, setDone] = useState<"Endorsed" | "Rejected" | null>(null);

  useEffect(() => {
    if (open) {
      setComment("");
      setRatings({ Attendance: 0, Discipline: 0, Punctuality: 0, "Work quality": 0 });
      setDone(null);
    }
  }, [open, log?.id]);

  if (!log) return null;
  const student = ASSIGNED_STUDENTS.find((s) => s.id === log.studentId);
  const totalHours = log.daily.reduce((a, b) => a + b.hours, 0);

  const submit = (decision: "Endorsed" | "Rejected") => {
    setDone(decision);
    onDecision?.(log.id, decision);
    setTimeout(onClose, 1400);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
              {student?.initials}
            </div>
            <div>
              <div className="text-base font-semibold">{student?.name}</div>
              <div className="text-xs text-muted-foreground font-normal">
                Week {log.week} · {log.range} · Submitted {log.submittedAt}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {done ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <div
              className={`h-14 w-14 rounded-full flex items-center justify-center ${
                done === "Endorsed"
                  ? "bg-success-soft text-success"
                  : "bg-destructive-soft text-destructive"
              }`}
            >
              {done === "Endorsed" ? <Check className="h-7 w-7" /> : <X className="h-7 w-7" />}
            </div>
            <div className="text-base font-semibold">
              {done === "Endorsed" ? "Logbook endorsed" : "Logbook rejected"}
            </div>
            <div className="text-xs text-muted-foreground">
              Endorsed by {supervisor.name} on {new Date().toLocaleString()}
            </div>
          </div>
        ) : (
          <div className="space-y-5 mt-2">
            {/* Summary */}
            <div className="rounded-lg bg-muted/50 p-4 text-sm leading-relaxed">{log.summary}</div>

            {/* Daily entries */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Daily entries · {totalHours}h total
              </div>
              <div className="space-y-3">
                {log.daily.map((d) => (
                  <div
                    key={d.day}
                    className="rounded-lg border border-border p-3 flex gap-3"
                  >
                    <div className="w-14 shrink-0 text-center">
                      <div className="text-xs font-semibold text-primary">{d.day}</div>
                      <div className="text-[11px] text-muted-foreground">{d.date}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">{d.tasks}</div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {d.skills.map((s) => (
                          <span
                            key={s}
                            className="text-[10px] font-medium bg-primary-soft text-primary px-1.5 py-0.5 rounded"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground self-center shrink-0">
                      {d.hours}h
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attachments */}
            {log.attachments && log.attachments.length > 0 && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Attachments
                </div>
                <div className="space-y-1.5">
                  {log.attachments.map((a) => (
                    <div
                      key={a.name}
                      className="flex items-center gap-2 text-sm border border-border rounded-md px-3 py-2"
                    >
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1">{a.name}</span>
                      <span className="text-xs text-muted-foreground">{a.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ratings */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Performance rating
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {RATING_CATS.map((cat) => (
                  <div
                    key={cat}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <span className="text-sm font-medium">{cat}</span>
                    <StarRating
                      value={ratings[cat]}
                      onChange={(n) => setRatings({ ...ratings, [cat]: n })}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Comment
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Optional feedback for the student…"
                className="w-full p-3 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>

            <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" /> AI summary: clear, technical, well-structured entry.
            </div>

            {/* Signature + actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileSignature className="h-4 w-4" />
                <span>
                  Endorsed by{" "}
                  <span className="font-medium text-foreground">{supervisor.name}</span> ·{" "}
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => submit("Rejected")}>
                  <X className="h-4 w-4 mr-1.5" /> Reject
                </Button>
                <Button onClick={() => submit("Endorsed")}>
                  <Check className="h-4 w-4 mr-1.5" /> Endorse
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
