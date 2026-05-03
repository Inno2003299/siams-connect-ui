import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import React from "react";

export type EntryStatus = "empty" | "draft" | "submitted";
export type WeekStatus = "draft" | "submitted" | "endorsed" | "reviewed";

export type DailyEntry = {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  dayLabel: string; // "Monday"
  dateLabel: string; // "Sept 9"
  tasks: string;
  skills: string[];
  hours: number;
  status: EntryStatus;
};

export type WeekData = {
  weekNumber: number;
  label: string; // "Week 1"
  range: string; // "Sept 9 - Sept 15"
  startDate: string; // ISO
  endDate: string; // ISO
  status: WeekStatus;
  entries: DailyEntry[];
};

export type MonthlySkills = {
  month: string; // "2025-09"
  content: string;
  submitted: boolean;
};

type LogbookState = {
  weeks: WeekData[];
  monthlySkills: MonthlySkills[];
  currentWeekIndex: number;
};

type LogbookCtx = {
  state: LogbookState;
  addEntry: (weekIndex: number, entry: Omit<DailyEntry, "id">) => void;
  updateEntry: (weekIndex: number, entryId: string, updates: Partial<DailyEntry>) => void;
  submitEntry: (weekIndex: number, entryId: string) => void;
  submitWeek: (weekIndex: number) => void;
  saveMonthlySkills: (month: string, content: string) => void;
  submitMonthlySkills: (month: string) => void;
  getTodayEntry: (weekIndex: number) => DailyEntry | undefined;
  hasTodayEntry: (weekIndex: number) => boolean;
};

const KEY = "siams.logbook.data";
const Ctx = createContext<LogbookCtx | null>(null);

function generateWeeks(startDate: string, endDate: string): WeekData[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
    return generateDefaultWeeks();
  }

  const weeks: WeekData[] = [];
  const current = new Date(start);
  // Align to Monday
  const dayOfWeek = current.getDay();
  if (dayOfWeek !== 1) {
    current.setDate(current.getDate() - ((dayOfWeek + 6) % 7));
  }

  let weekNum = 1;
  while (current < end) {
    const weekStart = new Date(current);
    const weekEnd = new Date(current);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    weeks.push({
      weekNumber: weekNum,
      label: `Week ${weekNum}`,
      range: `${fmt(weekStart)} – ${fmt(weekEnd)}`,
      startDate: weekStart.toISOString().split("T")[0],
      endDate: weekEnd.toISOString().split("T")[0],
      status: "draft",
      entries: [],
    });

    current.setDate(current.getDate() + 7);
    weekNum++;
  }

  return weeks;
}

function generateDefaultWeeks(): WeekData[] {
  const weeks: WeekData[] = [];
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7)); // align to Monday
  start.setDate(start.getDate() - 7 * 8); // 8 weeks ago

  for (let i = 0; i < 12; i++) {
    const weekStart = new Date(start);
    weekStart.setDate(weekStart.getDate() + i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    weeks.push({
      weekNumber: i + 1,
      label: `Week ${i + 1}`,
      range: `${fmt(weekStart)} – ${fmt(weekEnd)}`,
      startDate: weekStart.toISOString().split("T")[0],
      endDate: weekEnd.toISOString().split("T")[0],
      status: "draft",
      entries: [],
    });
  }
  return weeks;
}

function getCurrentWeekIndex(weeks: WeekData[]): number {
  const today = new Date().toISOString().split("T")[0];
  const idx = weeks.findIndex((w) => today >= w.startDate && today <= w.endDate);
  return idx >= 0 ? idx : 0;
}

function getInitialState(commencement?: string, completion?: string): LogbookState {
  const weeks = commencement && completion ? generateWeeks(commencement, completion) : generateDefaultWeeks();
  return {
    weeks,
    monthlySkills: [],
    currentWeekIndex: getCurrentWeekIndex(weeks),
  };
}

export function LogbookProvider({ children, commencement, completion }: { children: ReactNode; commencement?: string; completion?: string }) {
  const [state, setState] = useState<LogbookState>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as LogbookState;
        parsed.currentWeekIndex = getCurrentWeekIndex(parsed.weeks);
        return parsed;
      }
    } catch {}
    return getInitialState(commencement, completion);
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const addEntry = (weekIndex: number, entry: Omit<DailyEntry, "id">) => {
    setState((prev) => {
      const weeks = [...prev.weeks];
      const week = { ...weeks[weekIndex], entries: [...weeks[weekIndex].entries] };
      // Prevent duplicate for same date
      if (week.entries.some((e) => e.date === entry.date)) return prev;
      week.entries.push({ ...entry, id: crypto.randomUUID() });
      weeks[weekIndex] = week;
      return { ...prev, weeks };
    });
  };

  const updateEntry = (weekIndex: number, entryId: string, updates: Partial<DailyEntry>) => {
    setState((prev) => {
      const weeks = [...prev.weeks];
      const week = { ...weeks[weekIndex], entries: weeks[weekIndex].entries.map((e) => (e.id === entryId ? { ...e, ...updates } : e)) };
      weeks[weekIndex] = week;
      return { ...prev, weeks };
    });
  };

  const submitEntry = (weekIndex: number, entryId: string) => {
    updateEntry(weekIndex, entryId, { status: "submitted" });
  };

  const submitWeek = (weekIndex: number) => {
    setState((prev) => {
      const weeks = [...prev.weeks];
      weeks[weekIndex] = { ...weeks[weekIndex], status: "submitted" };
      return { ...prev, weeks };
    });
  };

  const saveMonthlySkills = (month: string, content: string) => {
    setState((prev) => {
      const existing = prev.monthlySkills.findIndex((m) => m.month === month);
      const skills = [...prev.monthlySkills];
      if (existing >= 0) {
        skills[existing] = { ...skills[existing], content };
      } else {
        skills.push({ month, content, submitted: false });
      }
      return { ...prev, monthlySkills: skills };
    });
  };

  const submitMonthlySkills = (month: string) => {
    setState((prev) => {
      const skills = prev.monthlySkills.map((m) => (m.month === month ? { ...m, submitted: true } : m));
      return { ...prev, monthlySkills: skills };
    });
  };

  const getTodayEntry = (weekIndex: number) => {
    const today = new Date().toISOString().split("T")[0];
    return state.weeks[weekIndex]?.entries.find((e) => e.date === today);
  };

  const hasTodayEntry = (weekIndex: number) => !!getTodayEntry(weekIndex);

  return React.createElement(Ctx.Provider, {
    value: { state, addEntry, updateEntry, submitEntry, submitWeek, saveMonthlySkills, submitMonthlySkills, getTodayEntry, hasTodayEntry },
    children,
  });
}

export function useLogbook() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLogbook must be used within LogbookProvider");
  return ctx;
}
