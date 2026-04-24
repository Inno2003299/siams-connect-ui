import { useQuickActions } from "@/lib/quickActions";
import { LetterPreviewModal } from "./LetterPreviewModal";
import { NewEntryModal } from "./NewEntryModal";
import { ApplyCompanyModal, UploadDocumentModal } from "./SimpleActionModal";

export function QuickActionsModals() {
  const { open, setOpen } = useQuickActions();
  return (
    <>
      <LetterPreviewModal open={open === "letter"} onClose={() => setOpen(null)} />
      <NewEntryModal open={open === "newEntry"} onClose={() => setOpen(null)} />
      <ApplyCompanyModal open={open === "apply"} onClose={() => setOpen(null)} />
      <UploadDocumentModal open={open === "upload"} onClose={() => setOpen(null)} />
    </>
  );
}
