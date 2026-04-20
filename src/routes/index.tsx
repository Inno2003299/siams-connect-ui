import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useRole } from "@/lib/role";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { isAuthed, role } = useRole();
  if (!isAuthed) return <Navigate to="/login" />;
  return <Navigate to={`/${role}` as "/student"} />;
}
