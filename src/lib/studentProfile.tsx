import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type StudentParticulars = {
  surname: string;
  studentId: string;
  email: string;
  faculty: string;
  department: string;
  program: string;
  commencement: string; // ISO date
  completion: string; // ISO date
  photoDataUrl: string | null;
  completed: boolean;
};

const DEFAULTS: StudentParticulars = {
  surname: "Otieno",
  studentId: "ENG/2021/0451",
  email: "amina.o@uni.edu",
  faculty: "",
  department: "",
  program: "",
  commencement: "",
  completion: "",
  photoDataUrl: null,
  completed: false,
};

type Ctx = {
  profile: StudentParticulars;
  setProfile: (p: StudentParticulars) => void;
  ready: boolean;
};

const C = createContext<Ctx | null>(null);
const KEY = "siams.student.particulars";

export function StudentProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<StudentParticulars>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setProfileState({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
    setReady(true);
  }, []);

  const setProfile = (p: StudentParticulars) => {
    setProfileState(p);
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
    } catch {}
  };

  return <C.Provider value={{ profile, setProfile, ready }}>{children}</C.Provider>;
}

export function useStudentProfile() {
  const ctx = useContext(C);
  if (!ctx) throw new Error("useStudentProfile must be used within StudentProfileProvider");
  return ctx;
}

/** Returns { week, total } based on commencement+completion. Falls back to {1,12}. */
export function getTrainingProgress(p: StudentParticulars): { week: number; total: number } {
  if (!p.commencement || !p.completion) return { week: 1, total: 12 };
  const start = new Date(p.commencement).getTime();
  const end = new Date(p.completion).getTime();
  const now = Date.now();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return { week: 1, total: 12 };
  const totalWeeks = Math.max(1, Math.round((end - start) / (7 * 24 * 60 * 60 * 1000)));
  const elapsedWeeks = Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000)) + 1;
  const week = Math.min(totalWeeks, Math.max(1, elapsedWeeks));
  return { week, total: totalWeeks };
}
