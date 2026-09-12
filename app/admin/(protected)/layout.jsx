import { redirect } from "next/navigation";
import { isAdminAuthed } from "../../../lib/auth.js";
import AdminSidebar from "../../../components/AdminSidebar.jsx";

export default function AdminProtectedLayout({ children }) {
  if (!isAdminAuthed()) redirect("/admin/login");

  return (
    <div className="min-h-screen flex bg-bg">
      <AdminSidebar />
      <div className="flex-1 min-w-0 p-6 md:p-10">{children}</div>
    </div>
  );
}
