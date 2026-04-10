import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { AdminNotificationsProvider } from "@/contexts/AdminNotificationsContext";
import AdminSidebar from "@/components/admin/AdminSidebar";

const AdminLayout = () => {
  const { isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin", { replace: true });
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <AdminNotificationsProvider>
      <div className="min-h-screen bg-[hsl(var(--dark-section))] flex overflow-x-hidden">
        <AdminSidebar />
        <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </AdminNotificationsProvider>
  );
};

export default AdminLayout;
