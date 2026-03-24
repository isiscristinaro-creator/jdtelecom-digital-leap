import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AdminAuthProvider>
          <BrowserRouter>
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
          </BrowserRouter>
        </AdminAuthProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
