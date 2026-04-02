import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { CityProvider } from "@/contexts/CityContext";
import CitySelector from "@/components/CitySelector";
import Index from "./pages/Index.tsx";
import SubscriberLogin from "./pages/SubscriberLogin.tsx";
import SubscriberDashboard from "./pages/SubscriberDashboard.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminClients from "./pages/admin/AdminClients.tsx";
import AdminPlans from "./pages/admin/AdminPlans.tsx";
import AdminPayments from "./pages/admin/AdminPayments.tsx";
import AdminReports from "./pages/admin/AdminReports.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";
import AdminTeam from "./pages/admin/AdminTeam.tsx";
import AdminLogs from "./pages/admin/AdminLogs.tsx";
import Cadastro from "./pages/Cadastro.tsx";
import Movel5G from "./pages/Movel5G.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const HIDE_CITY_ROUTES = ["/assinante", "/admin", "/movel"];

const RoutesWithCitySelector = () => {
  const location = useLocation();
  const hideCitySelector = HIDE_CITY_ROUTES.some(
    (r) => location.pathname === r || location.pathname.startsWith("/admin/") || location.pathname.startsWith("/assinante/") || location.pathname.startsWith("/movel")
  );

  return (
    <>
      {!hideCitySelector && <CitySelector />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/assinante" element={<SubscriberLogin />} />
        <Route path="/assinante/dashboard" element={<SubscriberDashboard />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/clientes" element={<AdminClients />} />
          <Route path="/admin/planos" element={<AdminPlans />} />
          <Route path="/admin/pagamentos" element={<AdminPayments />} />
          <Route path="/admin/relatorios" element={<AdminReports />} />
          <Route path="/admin/configuracoes" element={<AdminSettings />} />
          <Route path="/admin/equipe" element={<AdminTeam />} />
          <Route path="/admin/logs" element={<AdminLogs />} />
        </Route>
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CityProvider>
        <AuthProvider>
          <AdminAuthProvider>
            <BrowserRouter>
              <RoutesWithCitySelector />
            </BrowserRouter>
          </AdminAuthProvider>
        </AuthProvider>
      </CityProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
