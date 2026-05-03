import { useState, useCallback } from "react";
import {
  Calendar, Plus, Clock, ChevronRight, ChevronLeft,
  BookOpen, CheckCircle2, AlertCircle, Send, FileText,
  Sparkles, Check, X, Bell
} from "lucide-react";
import { useLogbook, type WeekData, type DailyEntry, type WeekStatus } from "@/lib/logbookData";
import { useStudentProfile } from "@/lib/studentProfile";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function getWeekDays(week: WeekData): { date: string; dayLabel: string; dateLabel: string }[] {
  const start = new Date(week.startDate + "T00:00:00");
  const days: { date: string; dayLabel: string; dateLabel: string }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    days.push({
      date: d.toISOString().split("T")[0],
      dayLabel: DAY_NAMES[i],
      dateLabel: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    });
  }
  return days;
}

const statusColor: Record<WeekStatus, { dot: string; bg: string; text: string; label: string }> = {
  draft: { dot: "bg-muted-foreground/50", bg: "bg-muted", text: "text-muted-foreground", label: "Draft" },
  submitted: { dot: "bg-[#1E3A8A]", bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-[#1E3A8A] dark:text-blue-400", label: "Submitted" },
  endorsed: { dot: "bg-green-600", bg: "bg-green-50 dark:bg-green-950/30", text: "text-green-700 dark:text-green-400", label: "Endorsed" },
  reviewed: { dot: "bg-green-800", bg: "bg-green-100 dark:bg-green-900/40", text: "text-green-800 dark:text-green-300", label: "Reviewed" },
};

export function LogbookDashboard() {
  const { profile } = useStudentProfile();
  const { state, addEntry, submitEntry, submitWeek, saveMonthlySkills, submitMonthlySkills, hasTodayEntry } = useLogbook();
  const { weeks, currentWeekIndex, monthlySkills } = state;

  const [selectedWeekIdx, setSelectedWeekIdx] = useState(currentWeekIndex);
  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DailyEntry | null>(null);
  const [editingDate, setEditingDate] = useState<{ date: string; dayLabel: string; dateLabel: string } | null>(null);
  const [confirmSubmitWeek, setConfirmSubmitWeek] = useState(false);
  const [monthlyTab, setMonthlyTab] = useState(false);

  const selectedWeek = weeks[selectedWeekIdx];
  if (!selectedWeek) return null;

  const weekDays = getWeekDays(selectedWeek);
  const completedDays = selectedWeek.entries.length;
  const progressPct = Math.round((completedDays / 7) * 100);
  const isCurrentWeek = selectedWeekIdx === currentWeekIndex;
  const today = new Date().toISOString().split("T")[0];
  const weekLocked = selectedWeek.status !== "draft";

  const totalWeeks = weeks.length;
  const completedWeeks = weeks.filter((w) => w.status !== "draft").length;

  const openNewEntry = () => {
    if (weekLocked) return;
    setEditingEntry(null);
    const todayDay = weekDays.find((d) => d.date === today);
    setEditingDate(todayDay || weekDays[0]);
    setEntryModalOpen(true);
  };

  const openDayEntry = (day: { date: string; dayLabel: string; dateLabel: string }) => {
    const existing = selectedWeek.entries.find((e) => e.date === day.date);
    if (existing) {
      setEditingEntry(existing);
      setEditingDate(day);
      setEntryModalOpen(true);
    } else if (!weekLocked) {
      setEditingEntry(null);
      setEditingDate(day);
      setEntryModalOpen(true);
    }
  };

  const handleSaveEntry = (data: { tasks: string; skills: string[]; hours: number; status: "draft" | "submitted" }, date: string, dayLabel: string, dateLabel: string) => {
    addEntry(selectedWeekIdx, {
      date,
      dayLabel,
      dateLabel,
      tasks: data.tasks,
      skills: data.skills,
      hours: data.hours,
      status: data.status,
    });
    setEntryModalOpen(false);
  };

  const handleSubmitWeek = () => {
    submitWeek(selectedWeekIdx);
    setConfirmSubmitWeek(false);
  };

  const canSubmitWeek = selectedWeek.entries.length > 0 && selectedWeek.status === "draft";
  const hasNoEntryToday = isCurrentWeek && !hasTodayEntry(selectedWeekIdx);

  // Monthly skills
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthSkills = monthlySkills.find((m) => m.month === currentMonth);
  const [monthlyContent, setMonthlyContent] = useState(currentMonthSkills?.content || "");

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Logbook</h1>
            <p className="text-xs text-muted-foreground">Track your daily activities and progress</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-9 w-9 rounded-lg border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors">
              <Bell className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-primary/20 bg-muted">
              {profile.photoDataUrl ? (
                <img src={profile.photoDataUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-muted-foreground">
                  {profile.surname?.[0] || "S"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reminder banner */}
      {hasNoEntryToday && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-sm text-amber-800 dark:text-amber-300">You haven't submitted today's entry</span>
            <button onClick={openNewEntry} className="ml-auto text-xs font-semibold text-amber-700 dark:text-amber-300 hover:underline">
              Add now →
            </button>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span className="font-medium">{completedWeeks} / {totalWeeks} weeks completed</span>
          <span>{Math.round((completedWeeks / totalWeeks) * 100)}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(completedWeeks / totalWeeks) * 100}%` }} />
        </div>
      </div>

      {/* Main 2-column layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT PANEL — Week Navigation */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="text-sm font-semibold">Weeks</h2>
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {weeks.map((w, i) => {
                  const sc = statusColor[w.status];
                  const active = i === selectedWeekIdx;
                  const isCurrent = i === currentWeekIndex;
                  return (
                    <button
                      key={w.weekNumber}
                      onClick={() => { setSelectedWeekIdx(i); setMonthlyTab(false); }}
                      className={`w-full text-left px-4 py-3 border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors flex items-center justify-between gap-2 ${
                        active ? "bg-primary/5 border-l-2 border-l-primary" : ""
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{w.label}</span>
                          {isCurrent && (
                            <span className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">Now</span>
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{w.range}</div>
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${sc.dot}`} />
                        <span className={`text-[10px] font-medium ${sc.text}`}>{sc.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {/* Monthly skills link */}
              <button
                onClick={() => setMonthlyTab(true)}
                className={`w-full text-left px-4 py-3 border-t border-border hover:bg-muted/50 transition-colors flex items-center gap-2 ${monthlyTab ? "bg-primary/5" : ""}`}
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Monthly Skills</span>
              </button>
            </div>
          </div>

          {/* RIGHT PANEL — Dynamic Content */}
          <div className="flex-1 min-w-0">
            {monthlyTab ? (
              <MonthlySkillsPanel
                content={monthlyContent}
                onChange={setMonthlyContent}
                onSave={() => saveMonthlySkills(currentMonth, monthlyContent)}
                onSubmit={() => {
                  saveMonthlySkills(currentMonth, monthlyContent);
                  submitMonthlySkills(currentMonth);
                }}
                submitted={currentMonthSkills?.submitted || false}
                currentMonth={currentMonth}
              />
            ) : (
              <>
                {/* Week header */}
                <div className="rounded-xl border border-border bg-card shadow-card p-5 lg:p-6">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">{selectedWeek.label}</h2>
                        <WeekStatusBadge status={selectedWeek.status} />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{selectedWeek.range}</p>
                    </div>
                    {!weekLocked && (
                      <button
                        onClick={openNewEntry}
                        className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                      >
                        <Plus className="h-4 w-4" /> New Entry
                      </button>
                    )}
                  </div>

                  {/* Progress indicator */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                      <span>{completedDays} of 7 days completed</span>
                      <span>{progressPct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>
                </div>

                {/* Daily entries */}
                <div className="mt-4 space-y-2">
                  {weekDays.map((day) => {
                    const entry = selectedWeek.entries.find((e) => e.date === day.date);
                    const isToday = day.date === today;
                    const isPast = day.date < today;
                    const isFuture = day.date > today;

                    return (
                      <button
                        key={day.date}
                        onClick={() => openDayEntry(day)}
                        className={`w-full text-left rounded-xl border p-4 transition-all hover:shadow-md ${
                          isToday
                            ? "border-primary/30 bg-primary/5 ring-1 ring-primary/10"
                            : "border-border bg-card hover:bg-muted/30"
                        } ${weekLocked && !entry ? "opacity-50 cursor-default" : "cursor-pointer"}`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-lg flex flex-col items-center justify-center shrink-0 ${
                              entry?.status === "submitted"
                                ? "bg-[#1E3A8A]/10 text-[#1E3A8A] dark:bg-blue-900/30 dark:text-blue-400"
                                : entry?.status === "draft"
                                  ? "bg-muted text-muted-foreground"
                                  : isToday
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted/50 text-muted-foreground/60"
                            }`}>
                              <span className="text-[9px] font-bold uppercase leading-none">{day.dayLabel.slice(0, 3)}</span>
                              <span className="text-xs font-bold leading-tight">{day.dateLabel.split(" ")[1]}</span>
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{day.dayLabel}</span>
                                {isToday && (
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">Today</span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">{day.dateLabel}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {entry ? (
                              <>
                                <DayStatusBadge status={entry.status} />
                                <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
                              </>
                            ) : isPast ? (
                              <span className="text-[10px] text-muted-foreground/60">No entry</span>
                            ) : isFuture ? (
                              <span className="text-[10px] text-muted-foreground/40">Upcoming</span>
                            ) : (
                              <span className="text-[10px] font-medium text-primary">+ Add</span>
                            )}
                          </div>
                        </div>

                        {entry && (
                          <div className="mt-2 pl-[52px]">
                            <p className="text-sm text-foreground/80 line-clamp-1">{entry.tasks}</p>
                            {entry.skills.length > 0 && (
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {entry.skills.slice(0, 4).map((s) => (
                                  <span key={s} className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{s}</span>
                                ))}
                                {entry.skills.length > 4 && (
                                  <span className="text-[10px] text-muted-foreground">+{entry.skills.length - 4}</span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Submit week */}
                <div className="mt-4 rounded-xl border border-border bg-card shadow-card p-5">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {selectedWeek.entries.length === 0 ? (
                        <span className="flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                          Add entries before submitting this week
                        </span>
                      ) : weekLocked ? (
                        <span className="flex items-center gap-1.5 text-green-700 dark:text-green-400">
                          <CheckCircle2 className="h-4 w-4" />
                          Week submitted — awaiting endorsement
                        </span>
                      ) : (
                        <span>{selectedWeek.entries.length} entries ready to submit</span>
                      )}
                    </div>
                    <button
                      onClick={() => setConfirmSubmitWeek(true)}
                      disabled={!canSubmitWeek}
                      className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1.5"
                    >
                      <Send className="h-4 w-4" /> Submit This Week
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Entry Modal */}
      {entryModalOpen && editingDate && (
        <EntryModal
          open={entryModalOpen}
          onClose={() => setEntryModalOpen(false)}
          entry={editingEntry}
          date={editingDate}
          locked={weekLocked}
          onSave={(data) => handleSaveEntry(data, editingDate.date, editingDate.dayLabel, editingDate.dateLabel)}
        />
      )}

      {/* Confirm submit week */}
      <Dialog open={confirmSubmitWeek} onOpenChange={setConfirmSubmitWeek}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Submit {selectedWeek.label}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Once submitted, you won't be able to edit entries for this week. The week will be sent for company endorsement.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setConfirmSubmitWeek(false)}>Cancel</Button>
            <Button onClick={handleSubmitWeek}>Submit Week</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------- Entry Modal ---------- */
function EntryModal({
  open, onClose, entry, date, locked, onSave,
}: {
  open: boolean;
  onClose: () => void;
  entry: DailyEntry | null;
  date: { date: string; dayLabel: string; dateLabel: string };
  locked: boolean;
  onSave: (data: { tasks: string; skills: string[]; hours: number; status: "draft" | "submitted" }) => void;
}) {
  const [tasks, setTasks] = useState(entry?.tasks || "");
  const [hours, setHours] = useState(entry?.hours || 8);
  const [skills, setSkills] = useState<string[]>(entry?.skills || []);
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v || skills.includes(v)) return;
    setSkills([...skills, v]);
    setSkillInput("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{entry ? "View Entry" : "New Entry"}</DialogTitle>
        </DialogHeader>

        {/* Auto date */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
            <Calendar className="h-3 w-3" /> {date.dayLabel}, {date.dateLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">
            <Clock className="h-3 w-3" /> {date.date}
          </span>
        </div>

        <div className="space-y-4 mt-2">
          <div>
            <label className="text-xs font-semibold text-foreground">Tasks performed</label>
            <textarea
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder="Describe what you worked on…"
              rows={5}
              disabled={locked}
              className="mt-1 w-full p-3 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">Skills / tools used</label>
            {!locked && (
              <div className="mt-1 flex items-center gap-2">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                  placeholder="e.g. Python, Figma, SQL"
                  className="flex-1 h-9 px-3 rounded-lg border border-input bg-background text-sm"
                />
                <Button type="button" size="sm" variant="outline" onClick={addSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
            {skills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
                    {s}
                    {!locked && (
                      <button onClick={() => setSkills(skills.filter((x) => x !== s))} className="hover:opacity-70">
                        <X className="h-3 w-3" />
                      </button>
                    )}
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
              disabled={locked}
              className="mt-1 w-32 h-9 px-3 rounded-lg border border-input bg-background text-sm disabled:opacity-60"
            />
          </div>
        </div>

        {!locked && !entry && (
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button variant="outline" onClick={() => { onSave({ tasks, skills, hours, status: "draft" }); }} disabled={tasks.trim().length < 5}>
              <FileText className="h-4 w-4 mr-1" /> Save Draft
            </Button>
            <Button onClick={() => { onSave({ tasks, skills, hours, status: "submitted" }); }} disabled={tasks.trim().length < 5}>
              <Send className="h-4 w-4 mr-1" /> Submit Entry
            </Button>
          </div>
        )}

        {locked && (
          <div className="flex justify-end mt-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        )}

        {entry && !locked && (
          <div className="flex justify-end mt-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Monthly Skills Panel ---------- */
function MonthlySkillsPanel({
  content, onChange, onSave, onSubmit, submitted, currentMonth,
}: {
  content: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onSubmit: () => void;
  submitted: boolean;
  currentMonth: string;
}) {
  const monthLabel = new Date(currentMonth + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="rounded-xl border border-border bg-card shadow-card p-5 lg:p-6">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Skills Acquired This Month</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{monthLabel}</p>

      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe the skills, tools, and experience you gained this month..."
        rows={8}
        disabled={submitted}
        className="w-full p-4 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
      />

      {submitted ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4" /> Monthly report submitted
        </div>
      ) : (
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onSave} disabled={content.trim().length < 10}>
            Save Draft
          </Button>
          <Button onClick={onSubmit} disabled={content.trim().length < 10}>
            <Send className="h-4 w-4 mr-1" /> Submit Monthly Report
          </Button>
        </div>
      )}
    </div>
  );
}

/* ---------- Badges ---------- */
function WeekStatusBadge({ status }: { status: WeekStatus }) {
  const sc = statusColor[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
      {sc.label}
    </span>
  );
}

function DayStatusBadge({ status }: { status: "empty" | "draft" | "submitted" }) {
  if (status === "submitted") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#1E3A8A] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded-full">
        <Check className="h-3 w-3" /> Submitted
      </span>
    );
  }
  if (status === "draft") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
        Draft
      </span>
    );
  }
  return null;
}
