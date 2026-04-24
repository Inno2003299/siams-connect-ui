import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, X, Plus } from "lucide-react";
import { useState } from "react";

export function NewEntryModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit?: (entry: { tasks: string; skills: string[]; hours: number }) => void;
}) {
  const now = new Date();
  const dateLabel = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeLabel = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState(8);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v || skills.includes(v)) return;
    setSkills([...skills, v]);
    setSkillInput("");
  };

  const reset = () => {
    setTasks("");
    setHours(8);
    setSkills([]);
    setSkillInput("");
  };

  const handleSubmit = () => {
    onSubmit?.({ tasks, skills, hours });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>New logbook entry</DialogTitle>
        </DialogHeader>

        {/* Auto date/time — no manual input */}
        <div className="flex flex-wrap items-center gap-3 -mt-1 mb-1 text-xs">
          <span className="inline-flex items-center gap-1.5 bg-primary-soft text-primary px-2.5 py-1 rounded-full font-medium">
            <Calendar className="h-3 w-3" /> {dateLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">
            <Clock className="h-3 w-3" /> {timeLabel}
          </span>
        </div>

        <div className="space-y-4 mt-2">
          <div>
            <label className="text-xs font-semibold text-foreground">Tasks performed</label>
            <textarea
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder="Describe what you worked on today…"
              rows={5}
              className="mt-1 w-full p-3 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">Skills / tools used</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="e.g. Python, Figma, SQL"
                className="flex-1 h-9 px-3 rounded-md border border-input bg-background text-sm"
              />
              <Button type="button" size="sm" variant="outline" onClick={addSkill}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 bg-primary-soft text-primary text-xs font-medium px-2 py-0.5 rounded-full"
                  >
                    {s}
                    <button
                      onClick={() => setSkills(skills.filter((x) => x !== s))}
                      className="hover:opacity-70"
                      aria-label={`Remove ${s}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">Hours worked</label>
            <input
              type="number"
              min={0}
              max={24}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="mt-1 w-32 h-9 px-3 rounded-md border border-input bg-background text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={tasks.trim().length < 5}>
            Save entry
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
