import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "student" | "company" | "supervisor" | "admin";

export const ROLE_LABEL: Record<Role, string> = {
  student: "Student",
  company: "Company Supervisor",
  supervisor: "Academic Supervisor",
  admin: "Admin",
};

export const ROLE_USER: Record<Role, { name: string; email: string; initials: string }> = {
  student: { name: "Amina Otieno", email: "amina.o@uni.edu", initials: "AO" },
  company: { name: "Peter Njoroge", email: "p.njoroge@acme.co", initials: "PN" },
  supervisor: { name: "Dr. Mwangi", email: "j.mwangi@uni.edu", initials: "JM" },
  admin: { name: "Sarah Kimani", email: "admin@uni.edu", initials: "SK" },
};

type Ctx = {
  role: Role;
  setRole: (r: Role) => void;
  isAuthed: boolean;
  setAuthed: (v: boolean) => void;
  ready: boolean;
};

const RoleContext = createContext<Ctx | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("student");
  const [isAuthed, setAuthedState] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const r = localStorage.getItem("siams.role") as Role | null;
      const a = localStorage.getItem("siams.authed") === "1";
      if (r === "student" || r === "company" || r === "supervisor" || r === "admin") setRoleState(r);
      setAuthedState(a);
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  const setRole = (r: Role) => {
    setRoleState(r);
    localStorage.setItem("siams.role", r);
  };
  const setAuthed = (v: boolean) => {
    setAuthedState(v);
    localStorage.setItem("siams.authed", v ? "1" : "0");
  };

  return (
    <RoleContext.Provider value={{ role, setRole, isAuthed, setAuthed, ready }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
