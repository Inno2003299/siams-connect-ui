import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { useStudentProfile } from "@/lib/studentProfile";
import { ROLE_USER } from "@/lib/role";
import { Camera, Lock, Upload } from "lucide-react";

const FACULTIES = ["Engineering", "Science", "Business", "Arts", "Education"];
const DEPARTMENTS = ["Computer Science", "Electrical", "Mechanical", "Civil", "Information Technology"];
const PROGRAMS = ["BSc Computer Science", "BSc Software Engineering", "BSc Information Technology", "BEng Electrical", "BEng Mechanical"];

export function LogbookSetupModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { profile, setProfile } = useStudentProfile();
  const user = ROLE_USER.student;

  const [photo, setPhoto] = useState<string | null>(profile.photoDataUrl);
  const [faculty, setFaculty] = useState(profile.faculty);
  const [department, setDepartment] = useState(profile.department);
  const [program, setProgram] = useState(profile.program);
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

  const canSave =
    attest && faculty && department && program && commencement && completion && new Date(completion) > new Date(commencement);

  const handleSave = () => {
    setProfile({
      ...profile,
      email: user.email,
      faculty,
      department,
      program,
      commencement,
      completion,
      photoDataUrl: photo,
      completed: true,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Logbook Entry</DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Complete your particulars to initialize your logbook. This is a one-time setup.
          </p>
        </DialogHeader>

        {/* Photo */}
        <div className="flex justify-center mt-2">
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              onPhoto(e.dataTransfer.files?.[0]);
            }}
            className="relative w-32 h-32 rounded-xl border-2 border-dashed border-border bg-muted/30 hover:bg-muted/60 cursor-pointer flex items-center justify-center overflow-hidden transition-colors"
          >
            {photo ? (
              <img src={photo} alt="Passport" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-muted-foreground">
                <Camera className="h-6 w-6 mx-auto mb-1" />
                <div className="text-[10px]">Drag photo or click</div>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onPhoto(e.target.files?.[0])}
            />
          </div>
        </div>
        <div className="text-center -mt-1">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-[11px] text-primary font-medium inline-flex items-center gap-1 hover:underline"
          >
            <Upload className="h-3 w-3" /> Upload passport photo
          </button>
        </div>

        {/* Verified data */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          {[
            { label: "Surname", value: profile.surname },
            { label: "Student ID", value: profile.studentId },
            { label: "Email", value: user.email },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                {f.label}
              </label>
              <div className="mt-1 flex items-center gap-2 h-9 px-3 rounded-md border border-input bg-muted/40 text-sm">
                <Lock className="h-3 w-3 text-muted-foreground" />
                <span className="truncate">{f.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Academic */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
          <Select label="Faculty" value={faculty} onChange={setFaculty} options={FACULTIES} />
          <Select label="Department" value={department} onChange={setDepartment} options={DEPARTMENTS} />
          <Select label="Program" value={program} onChange={setProgram} options={PROGRAMS} />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <DateField label="Date of Commencement" value={commencement} onChange={setCommencement} />
          <DateField label="Date of Completion" value={completion} onChange={setCompletion} />
        </div>

        {/* Attestation */}
        <label className="mt-4 flex items-start gap-2 p-3 rounded-md bg-muted/40 border border-border cursor-pointer">
          <input
            type="checkbox"
            checked={attest}
            onChange={(e) => setAttest(e.target.checked)}
            className="mt-0.5"
          />
          <span className="text-xs text-foreground leading-snug">
            I, <strong>{user.name}</strong>, certify that these particulars are true and reflect my current placement
            status.
          </span>
        </label>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!canSave}>
            Save & Initialize Logbook
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
      />
    </div>
  );
}
