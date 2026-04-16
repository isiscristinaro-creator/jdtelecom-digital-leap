import { lazy, Suspense } from "react";
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

// Rotas públicas leves: import direto
import NotFound from "./pages/NotFound.tsx";

// Rotas pesadas / pouco visitadas: code-split via React.lazy
// Reduz bundle inicial de ~2.4MB para ~1.5MB (recharts/xlsx só carregam quando usados)
const SubscriberLogin = lazy(() => import("./pages/SubscriberLogin.tsx"));
const SubscriberDashboard = lazy(() => import("./pages/SubscriberDashboard.tsx"));
const SubscriberItems = lazy(() => import("./pages/SubscriberItems.tsx"));
const Cadastro = lazy(() => import("./pages/Cadastro.tsx"));
const Movel5G = lazy(() => import("./pages/Movel5G.tsx"));
const InternetFibra = lazy(() => import("./pages/InternetFibra.tsx"));
const InternetFWA5G = lazy(() => import("./pages/InternetFWA5G.tsx"));
const Combos = lazy(() => import("./pages/Combos.tsx"));

// Admin: chunk separado, só carrega para usuários do painel
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.tsx"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.tsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.tsx"));
const AdminClients = lazy(() => import("./pages/admin/AdminClients.tsx"));
const AdminPlans = lazy(() => import("./pages/admin/AdminPlans.tsx"));
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments.tsx"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports.tsx"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings.tsx"));
const AdminTeam = lazy(() => import("./pages/admin/AdminTeam.tsx"));
const AdminLogs = lazy(() => import("./pages/admin/AdminLogs.tsx"));
const AdminProdutos = lazy(() => import("./pages/admin/AdminProdutos.tsx"));
const AdminPedidos = lazy(() => import("./pages/admin/AdminPedidos.tsx"));
const AdminBanners = lazy(() => import("./pages/admin/AdminBanners.tsx"));
const AdminTestemunhos = lazy(() => import("./pages/admin/AdminTestemunhos.tsx"));
const AdminAtendimentos = lazy(() => import("./pages/admin/AdminAtendimentos.tsx"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Reduz refetches desnecessários: dados do site público mudam pouco
      staleTime: 60 * 1000, // 1min
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const HIDE_CITY_ROUTES = ["/assinante", "/admin", "/movel", "/fibra", "/fwa-5g", "/combos"];

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const RoutesWithCitySelector = () => {
  const location = useLocation();
  const hideCitySelector = HIDE_CITY_ROUTES.some(
    (r) => location.pathname === r || location.pathname.startsWith("/admin/") || location.pathname.startsWith("/assinante/") || location.pathname.startsWith("/movel")
  );

  return (
    <>
      {!hideCitySelector && <CitySelector />}
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/movel" element={<Movel5G />} />
          <Route path="/fibra" element={<InternetFibra />} />
          <Route path="/fwa-5g" element={<InternetFWA5G />} />
          <Route path="/combos" element={<Combos />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/assinante" element={<SubscriberLogin />} />
          <Route path="/assinante/dashboard" element={<SubscriberDashboard />} />
          <Route path="/assinante/items" element={<SubscriberItems />} />
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
            <Route path="/admin/produtos" element={<AdminProdutos />} />
            <Route path="/admin/pedidos" element={<AdminPedidos />} />
            <Route path="/admin/banners" element={<AdminBanners />} />
            <Route path="/admin/testemunhos" element={<AdminTestemunhos />} />
            <Route path="/admin/atendimentos" element={<AdminAtendimentos />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
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
