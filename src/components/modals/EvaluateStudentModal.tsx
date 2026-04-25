import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GraduationCap, Check, FileSignature } from "lucide-react";
import { useEffect, useState } from "react";
import { ASSIGNED_STUDENTS, type AssignedStudent } from "@/lib/companyData";
import { useRole, ROLE_USER } from "@/lib/role";

const RECOMMENDATIONS = [
  "Highly recommended for full-time hire",
  "Recommended for further internship",
  "Recommended with reservations",
  "Not recommended",
] as const;

export function EvaluateStudentModal({
  open,
  onClose,
  preselect,
}: {
  open: boolean;
  onClose: () => void;
  preselect?: AssignedStudent | null;
}) {
  const { role } = useRole();
  const supervisor = ROLE_USER[role];
  const [studentId, setStudentId] = useState<string>("");
  const [overall, setOverall] = useState(4);
  const [strengths, setStrengths] = useState("");
  const [weaknesses, setWeaknesses] = useState("");
  const [recommendation, setRecommendation] = useState<string>(RECOMMENDATIONS[0]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (open) {
      setStudentId(preselect?.id ?? ASSIGNED_STUDENTS[0].id);
      setOverall(4);
      setStrengths("");
      setWeaknesses("");
      setRecommendation(RECOMMENDATIONS[0]);
      setDone(false);
    }
  }, [open, preselect?.id]);

  const submit = () => {
    setDone(true);
    setTimeout(onClose, 1400);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" /> Final evaluation
          </DialogTitle>
        </DialogHeader>

        {done ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="h-14 w-14 rounded-full bg-success-soft text-success flex items-center justify-center">
              <Check className="h-7 w-7" />
            </div>
            <div className="text-base font-semibold">Evaluation submitted</div>
            <div className="text-xs text-muted-foreground">
              Signed by {supervisor.name} on {new Date().toLocaleString()}
            </div>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Student
              </label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                {ASSIGNED_STUDENTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Overall performance: <span className="text-foreground font-bold">{overall}/5</span>
              </label>
              <input
                type="range"
                min={1}
                max={5}
                value={overall}
                onChange={(e) => setOverall(Number(e.target.value))}
                className="mt-2 w-full accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Strengths
              </label>
              <textarea
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                rows={3}
                placeholder="What did the student excel at?"
                className="mt-1 w-full p-3 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Areas for improvement
              </label>
              <textarea
                value={weaknesses}
                onChange={(e) => setWeaknesses(e.target.value)}
                rows={3}
                placeholder="What should the student work on?"
                className="mt-1 w-full p-3 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Recommendation
              </label>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {RECOMMENDATIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRecommendation(r)}
                    className={`text-left text-sm rounded-lg border p-2.5 transition-colors ${
                      recommendation === r
                        ? "border-primary bg-primary-soft text-primary font-medium"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileSignature className="h-4 w-4" />
                <span>
                  Signed by{" "}
                  <span className="font-medium text-foreground">{supervisor.name}</span> ·{" "}
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={submit}>Submit evaluation</Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
