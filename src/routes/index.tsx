import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useRole } from "@/lib/role";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { isAuthed, role, ready } = useRole();
  if (!ready) return <div className="min-h-screen bg-background" />;
  if (!isAuthed) return <Navigate to="/login" />;
  if (role === "supervisor") return <Navigate to="/supervisor" />;
  if (role === "admin") return <Navigate to="/admin" />;
  if (role === "company") return <Navigate to="/company" />;
  return <Navigate to="/student" />;
}
