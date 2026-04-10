import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { AdminNotificationsProvider } from "@/contexts/AdminNotificationsContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminGlobalSearch from "@/components/admin/AdminGlobalSearch";

const AdminLayout = () => {
  const { isAuthenticated, loading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate("/admin", { replace: true });
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--dark-section))] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <AdminNotificationsProvider>
      <div className="min-h-screen bg-[hsl(var(--dark-section))] flex overflow-x-hidden">
        <AdminSidebar />
        <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto">
          <div className="sticky top-0 z-30 bg-[hsl(var(--dark-section))]/95 backdrop-blur-sm border-b border-[hsl(var(--dark-section-border))] px-4 md:px-6 py-3">
            <AdminGlobalSearch />
          </div>
          <Outlet />
        </main>
      </div>
    </AdminNotificationsProvider>
  );
};

export default AdminLayout;
