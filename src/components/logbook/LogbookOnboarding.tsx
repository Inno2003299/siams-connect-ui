import { useState, useRef, type ReactNode } from "react";
import { useStudentProfile } from "@/lib/studentProfile";
import { ROLE_USER } from "@/lib/role";
import { Camera, Upload, Lock, Check, ChevronLeft, ChevronRight, X, User, Shield, Phone, GraduationCap, Calendar, FileCheck } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

const FACULTIES = ["Engineering", "Science", "Business", "Arts", "Education"];
const DEPARTMENTS = ["Computer Science", "Electrical", "Mechanical", "Civil", "Information Technology"];
const PROGRAMS = ["BSc Computer Science", "BSc Software Engineering", "BSc Information Technology", "BEng Electrical", "BEng Mechanical"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];

const STEPS = [
  { label: "Identity", icon: User },
  { label: "Verified Info", icon: Shield },
  { label: "Contact", icon: Phone },
  { label: "Academic", icon: GraduationCap },
  { label: "Training", icon: Calendar },
  { label: "Attestation", icon: FileCheck },
] as const;

export function LogbookOnboarding() {
  const { profile, setProfile } = useStudentProfile();
  const user = ROLE_USER.student;
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState<string | null>(profile.photoDataUrl);
  const [phone, setPhoneVal] = useState(profile.phone);
  const [faculty, setFaculty] = useState(profile.faculty);
  const [department, setDepartment] = useState(profile.department);
  const [program, setProgram] = useState(profile.program);
  const [yearOfStudy, setYearOfStudy] = useState(profile.yearOfStudy);
  const [commencement, setCommencement] = useState(profile.commencement);
  const [completion, setCompletion] = useState(profile.completion);
  const [attest, setAttest] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onPhoto = (f?: File | null) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(f);
  };

  const canNext = (): boolean => {
    switch (step) {
      case 0: return true; // photo is optional
      case 1: return true; // read-only
      case 2: return phone.trim().length >= 6;
      case 3: return !!(faculty && department && program && yearOfStudy);
      case 4: return !!(commencement && completion && new Date(completion) > new Date(commencement));
      case 5: return attest;
      default: return false;
    }
  };

  const handleSave = () => {
    setProfile({
      ...profile,
      phone,
      faculty,
      department,
      program,
      yearOfStudy,
      commencement,
      completion,
      photoDataUrl: photo,
      completed: true,
    });
    navigate({ to: "/student/logbook" });
  };

  const next = () => {
    if (step === 5) {
      handleSave();
    } else {
      setStep((s) => Math.min(s + 1, 5));
    }
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="text-sm font-semibold text-foreground">Logbook Setup</div>
          <div className="text-xs text-muted-foreground">Step {step + 1} of 6</div>
        </div>
      </div>

      {/* Stepper */}
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 pt-6 pb-2">
        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = i < step;
            const active = i === step;
            return (
              <div key={s.label} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    done
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : active
                        ? "bg-primary/10 text-primary ring-2 ring-primary/30"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span
                  className={`text-[10px] font-medium hidden sm:block ${
                    active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
                {/* progress bar segment */}
                {i < STEPS.length - 1 && (
                  <div className="hidden" /> // spacer handled by flex gap
                )}
              </div>
            );
          })}
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Card content */}
      <div className="flex-1 flex items-start justify-center px-4 sm:px-6 py-6">
        <div className="w-full max-w-2xl">
          <div className="rounded-2xl border border-border bg-card shadow-card p-6 sm:p-8 animate-fade-in" key={step}>
            {step === 0 && (
              <StepContent title="Upload Your Photo" desc="Add a passport-sized photo for your logbook profile.">
                <div className="flex flex-col items-center gap-4">
                  <div
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={(e) => { e.preventDefault(); e.stopPropagation(); onPhoto(e.dataTransfer.files?.[0]); }}
                    className="relative w-40 h-40 rounded-2xl border-2 border-dashed border-border bg-muted/30 hover:bg-muted/60 cursor-pointer flex items-center justify-center overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-md"
                  >
                    {photo ? (
                      <img src={photo} alt="Passport" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
                        <div className="text-xs font-medium">Drag & drop</div>
                        <div className="text-[10px] text-muted-foreground/70">or click to browse</div>
                      </div>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPhoto(e.target.files?.[0])} />
                  </div>
                  {photo && (
                    <div className="flex gap-2">
                      <button onClick={() => fileRef.current?.click()} className="text-xs text-primary font-medium inline-flex items-center gap-1 hover:underline">
                        <Upload className="h-3 w-3" /> Replace
                      </button>
                      <button onClick={() => setPhoto(null)} className="text-xs text-destructive font-medium inline-flex items-center gap-1 hover:underline">
                        <X className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  )}
                </div>
              </StepContent>
            )}

            {step === 1 && (
              <StepContent title="Verified Information" desc="These details are pre-filled from your student record and cannot be edited.">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Surname", value: profile.surname },
                    { label: "Other Names", value: profile.otherNames },
                    { label: "Student ID", value: profile.studentId },
                    { label: "Email", value: user.email },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{f.label}</label>
                      <div className="mt-1.5 flex items-center gap-2 h-10 px-3.5 rounded-lg border border-input bg-muted/30 text-sm">
                        <Lock className="h-3 w-3 text-muted-foreground/60 shrink-0" />
                        <span className="truncate text-foreground/80">{f.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </StepContent>
            )}

            {step === 2 && (
              <StepContent title="Contact Information" desc="Provide a phone number where you can be reached during your training.">
                <div className="max-w-sm">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhoneVal(e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                    className="mt-1.5 w-full h-10 px-3.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </StepContent>
            )}

            {step === 3 && (
              <StepContent title="Academic Information" desc="Select your academic details for record keeping.">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField label="Faculty" value={faculty} onChange={setFaculty} options={FACULTIES} />
                  <SelectField label="Department" value={department} onChange={setDepartment} options={DEPARTMENTS} />
                  <SelectField label="Program" value={program} onChange={setProgram} options={PROGRAMS} />
                  <SelectField label="Year of Study" value={yearOfStudy} onChange={setYearOfStudy} options={YEARS} />
                </div>
              </StepContent>
            )}

            {step === 4 && (
              <StepContent title="Training Details" desc="Specify your attachment start and end dates.">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Start Date</label>
                    <input
                      type="date"
                      value={commencement}
                      onChange={(e) => setCommencement(e.target.value)}
                      className="mt-1.5 w-full h-10 px-3.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">End Date</label>
                    <input
                      type="date"
                      value={completion}
                      onChange={(e) => setCompletion(e.target.value)}
                      className="mt-1.5 w-full h-10 px-3.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  {commencement && completion && new Date(completion) <= new Date(commencement) && (
                    <p className="sm:col-span-2 text-xs text-destructive">End date must be after start date.</p>
                  )}
                </div>
              </StepContent>
            )}

            {step === 5 && (
              <StepContent title="Attestation" desc="Confirm that the information you have provided is accurate.">
                <label className="flex items-start gap-3 p-4 rounded-xl bg-muted/40 border border-border cursor-pointer hover:bg-muted/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={attest}
                    onChange={(e) => setAttest(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-input text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm text-foreground leading-relaxed">
                    I, <strong>{user.name}</strong>, confirm that the above information is correct and reflects my current placement status.
                  </span>
                </label>
              </StepContent>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={prev}
              disabled={step === 0}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-border bg-card text-sm font-medium hover:bg-muted disabled:opacity-0 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={next}
              disabled={!canNext()}
              className="inline-flex items-center gap-1.5 h-10 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {step === 5 ? (
                <>
                  <Check className="h-4 w-4" /> Save & Initialize Logbook
                </>
              ) : (
                <>
                  Continue <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepContent({ title, desc, children }: { title: string; desc: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1 mb-6">{desc}</p>
      {children}
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full h-10 px-3.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
