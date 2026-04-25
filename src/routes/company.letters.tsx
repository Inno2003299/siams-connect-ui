import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Section } from "@/components/ui-kit/StatCard";
import { LETTERS } from "@/lib/companyData";
import { Mail, Download, Eye, Clock } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/company/letters")({
  head: () => ({ meta: [{ title: "Student Letters — SIAMS" }] }),
  component: Letters,
});

function Letters() {
  const [preview, setPreview] = useState<typeof LETTERS[number] | null>(null);

  return (
    <AppShell title="Student Letters">
      <p className="text-sm text-muted-foreground mb-6">
        Introduction letters submitted by students for industrial attachment placement.
      </p>

      <Section title="Inbox">
        <div className="rounded-xl border border-border bg-card divide-y divide-border shadow-card">
          {LETTERS.map((l) => (
            <div key={l.id} className="flex items-center gap-4 p-4">
              <div className="h-10 w-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{l.subject}</div>
                <div className="text-[11px] text-muted-foreground truncate">
                  From {l.student} · {l.sentAt}
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium">
                {l.status === "Sent" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success-soft text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    Delivered
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning-soft text-warning">
                    <Clock className="h-3 w-3" /> Pending
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPreview(l)}
                  className="h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center"
                  aria-label="Preview"
                >
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </button>
                <button
                  className="h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center"
                  aria-label="Download"
                >
                  <Download className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Dialog open={!!preview} onOpenChange={(v) => !v && setPreview(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{preview?.subject}</DialogTitle>
          </DialogHeader>
          <div className="rounded-lg border border-border bg-muted/40 p-6 text-sm leading-relaxed">
            <div className="text-xs text-muted-foreground">
              From: {preview?.student} · {preview?.sentAt}
            </div>
            <p className="mt-4">Dear Sir/Madam,</p>
            <p className="mt-3">
              I am writing to formally request consideration for an industrial attachment
              placement at your organisation as part of my degree programme. Enclosed please find
              the official introduction letter from the university along with my CV.
            </p>
            <p className="mt-3">
              I look forward to your favourable consideration. Thank you for your time.
            </p>
            <p className="mt-3">Yours sincerely,</p>
            <p className="font-semibold">{preview?.student}</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPreview(null)}>
              Close
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-1.5" /> Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
