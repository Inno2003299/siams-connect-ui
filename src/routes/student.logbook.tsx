import { createFileRoute } from "@tanstack/react-router";
import { useStudentProfile } from "@/lib/studentProfile";
import { LogbookOnboarding } from "@/components/logbook/LogbookOnboarding";
import { LogbookDashboard } from "@/components/logbook/LogbookDashboard";
import { LogbookProvider } from "@/lib/logbookData";

export const Route = createFileRoute("/student/logbook")({
  head: () => ({ meta: [{ title: "Logbook — SIAMS" }] }),
  component: Logbook,
});

function Logbook() {
  const { profile } = useStudentProfile();

  if (!profile.completed) {
    return <LogbookOnboarding />;
  }

  return (
    <LogbookProvider commencement={profile.commencement} completion={profile.completion}>
      <LogbookDashboard />
    </LogbookProvider>
  );
}
