import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuickActions } from "@/lib/quickActions";
import { useRole } from "@/lib/role";
import { useStudentProfile } from "@/lib/studentProfile";
import { LetterPreviewModal } from "./LetterPreviewModal";
import { NewEntryModal } from "./NewEntryModal";
import { SubmitWeekModal } from "./SubmitWeekModal";
import { ApplyCompanyModal, UploadDocumentModal } from "./SimpleActionModal";
import { PendingLogbooksModal, ViewStudentsModal } from "./CompanyQuickModals";
import { EvaluateStudentModal } from "./EvaluateStudentModal";

export function QuickActionsModals() {
  const { open, setOpen } = useQuickActions();
  const { role } = useRole();
  const { profile } = useStudentProfile();
  const navigate = useNavigate();
  const close = () => setOpen(null);

  // Redirect to logbook page for setup if profile not completed
  useEffect(() => {
    const needsSetup =
      open === "setupLogbook" || (open === "newEntry" && !profile.completed);
    if (needsSetup) {
      setOpen(null);
      navigate({ to: "/student/logbook" });
    }
  }, [open, profile.completed, setOpen, navigate]);

  const showNewEntry = open === "newEntry" && profile.completed;

  return (
    <>
      {/* Student modals */}
      <LetterPreviewModal open={open === "letter"} onClose={close} />
      <NewEntryModal open={showNewEntry} onClose={close} />
      <SubmitWeekModal open={open === "submitWeek"} onClose={close} />
      <ApplyCompanyModal open={open === "apply"} onClose={close} />
      <UploadDocumentModal open={open === "upload"} onClose={close} />

      {/* Company supervisor modals */}
      <PendingLogbooksModal open={open === "pendingLogbooks"} onClose={close} />
      <ViewStudentsModal open={open === "viewStudents"} onClose={close} />
      <EvaluateStudentModal
        open={open === "evaluateStudent" && role === "company"}
        onClose={close}
      />
    </>
  );
}
