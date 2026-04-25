import { useQuickActions } from "@/lib/quickActions";
import { useRole } from "@/lib/role";
import { LetterPreviewModal } from "./LetterPreviewModal";
import { NewEntryModal } from "./NewEntryModal";
import { SubmitWeekModal } from "./SubmitWeekModal";
import { ApplyCompanyModal, UploadDocumentModal } from "./SimpleActionModal";
import { PendingLogbooksModal, ViewStudentsModal } from "./CompanyQuickModals";
import { EvaluateStudentModal } from "./EvaluateStudentModal";

export function QuickActionsModals() {
  const { open, setOpen } = useQuickActions();
  const { role } = useRole();
  const close = () => setOpen(null);
  return (
    <>
      {/* Student modals */}
      <LetterPreviewModal open={open === "letter"} onClose={close} />
      <NewEntryModal open={open === "newEntry"} onClose={close} />
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
