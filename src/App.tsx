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
