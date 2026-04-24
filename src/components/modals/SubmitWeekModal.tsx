import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarRange, Check, Send, Sparkles } from "lucide-react";
import { useState } from "react";

export function SubmitWeekModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [done, setDone] = useState(false);
  const [note, setNote] = useState("");

  // Compute the current week range
  const now = new Date();
  const day = now.getDay() || 7; // 1..7 (Mon..Sun)
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day - 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const range = `${fmt(monday)} – ${fmt(sunday)}`;

  const submit = () => {
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setNote("");
      onClose();
    }, 1300);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" /> Submit weekly logbook
          </DialogTitle>
        </DialogHeader>

        {done ? (
          <div className="flex flex-col items-center gap-2 py-6">
            <div className="h-12 w-12 rounded-full bg-success-soft text-success flex items-center justify-center">
              <Check className="h-6 w-6" />
            </div>
            <div className="text-sm font-medium">Week submitted for endorsement</div>
            <div className="text-xs text-muted-foreground">Your company supervisor will be notified.</div>
          </div>
        ) : (
          <div className="space-y-4 mt-1">
            <div className="rounded-lg border border-border bg-muted/40 p-3 flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-primary-soft text-primary flex items-center justify-center">
                <CalendarRange className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Current week</div>
                <div className="text-sm font-semibold">{range}</div>
              </div>
            </div>

            <div className="rounded-lg bg-primary-soft/50 p-3 text-xs text-foreground/80 flex items-start gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
              <span>
                AI quality check passed. Your daily entries will be sent to{" "}
                <span className="font-semibold">Acme Industries</span> for endorsement.
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold">Note to supervisor (optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Anything you'd like your supervisor to know…"
                className="mt-1 w-full p-2.5 rounded-md border border-input bg-background text-sm resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={submit}>
                <Send className="h-4 w-4 mr-1.5" /> Submit week
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
