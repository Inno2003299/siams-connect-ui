import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download, Mail, Check, Clock, X } from "lucide-react";
import { useRef, useState } from "react";
import { useRole, ROLE_USER } from "@/lib/role";

type SendStatus = "idle" | "pending" | "sent" | "failed";

export function LetterPreviewModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { role } = useRole();
  const user = ROLE_USER[role];
  const letterRef = useRef<HTMLDivElement>(null);
  const [emailOpen, setEmailOpen] = useState(false);
  const [status, setStatus] = useState<SendStatus>("idle");
  const [to, setTo] = useState("hr@acme-industries.co");
  const [subject, setSubject] = useState("Industrial Attachment Introduction Letter — Amina Otieno");
  const [message, setMessage] = useState(
    "Dear Sir/Madam,\n\nPlease find attached the official introduction letter for our student undertaking industrial attachment at your company.\n\nKind regards,\nDepartment of Industrial Liaison",
  );

  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const handlePrint = () => {
    const printContents = letterRef.current?.innerHTML;
    if (!printContents) return;
    const w = window.open("", "_blank", "width=800,height=900");
    if (!w) return;
    w.document.write(`<html><head><title>Attachment Letter</title>
      <style>
        body{font-family:Georgia,serif;color:#111;padding:48px;line-height:1.6;max-width:720px;margin:0 auto;}
        h1{font-size:18px;text-align:center;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;}
        .muted{color:#666;font-size:12px;}
        .row{display:flex;justify-content:space-between;margin:8px 0;}
        .sig{margin-top:64px;border-top:1px solid #333;padding-top:6px;width:240px;font-size:12px;}
      </style></head><body>${printContents}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); w.close(); }, 200);
  };

  const handleDownload = () => {
    const html = letterRef.current?.innerHTML ?? "";
    const blob = new Blob(
      [`<html><head><meta charset="utf-8"><title>Attachment Letter</title></head><body style="font-family:Georgia,serif;padding:48px;max-width:720px;margin:0 auto;">${html}</body></html>`],
      { type: "text/html" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attachment-letter-amina-otieno.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSend = () => {
    setStatus("pending");
    setTimeout(() => {
      // 90% success rate for the demo
      setStatus(Math.random() > 0.1 ? "sent" : "failed");
    }, 1400);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Industrial Attachment Letter</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2 -mt-2 mb-2">
          <Button size="sm" variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-1.5" /> Print
          </Button>
          <Button size="sm" variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1.5" /> Download
          </Button>
          <Button size="sm" onClick={() => setEmailOpen(true)}>
            <Mail className="h-4 w-4 mr-1.5" /> Send via email
          </Button>
          {status !== "idle" && (
            <span
              className={`ml-auto inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                status === "sent"
                  ? "bg-success-soft text-success"
                  : status === "pending"
                    ? "bg-warning-soft text-warning"
                    : "bg-destructive-soft text-destructive"
              }`}
            >
              {status === "sent" && <Check className="h-3 w-3" />}
              {status === "pending" && <Clock className="h-3 w-3 animate-pulse" />}
              {status === "failed" && <X className="h-3 w-3" />}
              {status === "sent" ? "Sent" : status === "pending" ? "Sending…" : "Failed"}
            </span>
          )}
        </div>

        {/* Letter preview */}
        <div
          ref={letterRef}
          className="bg-white border border-border rounded-lg p-8 lg:p-10 text-foreground font-serif leading-relaxed shadow-sm"
        >
          <div className="text-center border-b border-border pb-4">
            <h1 className="text-base font-bold uppercase tracking-wider">University of Nairobi</h1>
            <div className="text-xs text-muted-foreground mt-1">School of Computing & Informatics</div>
            <div className="text-xs text-muted-foreground">P.O. Box 30197-00100, Nairobi · industrial.liaison@uonbi.ac.ke</div>
          </div>

          <div className="flex justify-between mt-6 text-sm">
            <div>Ref: SIAMS/IA/2025/0428</div>
            <div>{today}</div>
          </div>

          <div className="mt-8 text-sm">
            <div>The Human Resource Manager,</div>
            <div>Acme Industries Ltd,</div>
            <div>P.O. Box 12345-00100,</div>
            <div>Nairobi.</div>
          </div>

          <div className="mt-6 text-sm font-semibold underline">
            RE: INDUSTRIAL ATTACHMENT — MS. AMINA OTIENO (REG. NO. SCT221-0114/2022)
          </div>

          <p className="mt-5 text-sm">Dear Sir/Madam,</p>

          <p className="mt-3 text-sm">
            The above named is a bona fide student of the University of Nairobi pursuing a{" "}
            <strong>Bachelor of Science in Computer Science</strong>. As part of the curriculum, the student is
            required to undergo a <strong>twelve (12) week industrial attachment</strong> in a recognized
            organization.
          </p>

          <p className="mt-3 text-sm">
            We kindly request you to consider her application and offer her an attachment opportunity in your
            organization for the period <strong>15ᵗʰ January 2025</strong> to <strong>11ᵗʰ April 2025</strong>.
            The student is expected to be assigned meaningful tasks under the supervision of a designated
            company supervisor.
          </p>

          <p className="mt-3 text-sm">
            Upon completion, the company supervisor will be required to fill in an evaluation form and endorse
            the student&apos;s logbook through our SIAMS portal. Any assistance accorded will be highly
            appreciated.
          </p>

          <p className="mt-5 text-sm">Yours faithfully,</p>

          <div className="mt-12">
            <div className="border-t border-foreground w-56 pt-1 text-xs">
              <div className="font-semibold">Dr. J. Mwangi</div>
              <div className="text-muted-foreground">Industrial Liaison Officer</div>
              <div className="text-muted-foreground">University of Nairobi</div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-dashed border-border text-[10px] text-muted-foreground text-center">
            Generated via SIAMS · Verified by {user.name} · {today}
          </div>
        </div>

        {/* Email composer */}
        {emailOpen && (
          <div className="mt-4 border border-border rounded-lg p-4 bg-muted/30">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold">Send letter via email</div>
              <button
                onClick={() => setEmailOpen(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close email composer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">To</label>
                <input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="mt-1 w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Subject</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="mt-1 w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setEmailOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSend} disabled={status === "pending"}>
                  <Mail className="h-4 w-4 mr-1.5" />
                  {status === "pending" ? "Sending…" : "Send"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
