import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2, Upload, Check } from "lucide-react";
import { useState } from "react";

export function ApplyCompanyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [done, setDone] = useState(false);

  const submit = () => {
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setCompany("");
      setPosition("");
      onClose();
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> Apply to a company
          </DialogTitle>
        </DialogHeader>

        {done ? (
          <div className="flex flex-col items-center gap-2 py-6">
            <div className="h-12 w-12 rounded-full bg-success-soft text-success flex items-center justify-center">
              <Check className="h-6 w-6" />
            </div>
            <div className="text-sm font-medium">Application submitted</div>
          </div>
        ) : (
          <div className="space-y-3 mt-2">
            <div>
              <label className="text-xs font-semibold">Company name</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Safaricom PLC"
                className="mt-1 w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold">Position</label>
              <input
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. Software Engineering Intern"
                className="mt-1 w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={submit} disabled={!company || !position}>
                Submit application
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function UploadDocumentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [done, setDone] = useState(false);

  const submit = () => {
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setFile(null);
      onClose();
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" /> Upload document
          </DialogTitle>
        </DialogHeader>

        {done ? (
          <div className="flex flex-col items-center gap-2 py-6">
            <div className="h-12 w-12 rounded-full bg-success-soft text-success flex items-center justify-center">
              <Check className="h-6 w-6" />
            </div>
            <div className="text-sm font-medium">Uploaded successfully</div>
          </div>
        ) : (
          <div className="space-y-3 mt-2">
            <label className="block border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <div className="mt-2 text-sm font-medium">
                {file ? file.name : "Click to choose a file"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">PDF, DOCX, or images</div>
              <input
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={submit} disabled={!file}>
                Upload
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
