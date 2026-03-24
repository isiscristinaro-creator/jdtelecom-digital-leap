import { useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useState } from "react";
import {
  LayoutDashboard, Users, Package, CreditCard, BarChart3, LogOut, Menu, X, ChevronLeft, Settings
} from "lucide-react";
import logo from "@/assets/logo.png";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Clientes", href: "/admin/clientes", icon: Users },
  { label: "Planos", href: "/admin/planos", icon: Package },
  { label: "Pagamentos", href: "/admin/pagamentos", icon: CreditCard },
  { label: "Relatórios", href: "/admin/relatorios", icon: BarChart3 },
  { label: "Configurações", href: "/admin/configuracoes", icon: Settings },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdminAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/admin", { replace: true }); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-[hsl(var(--dark-section-border))]">
        {!collapsed && <img src={logo} alt="JD Telecom" className="h-8 brightness-0 invert" />}
        <button onClick={() => { setCollapsed(!collapsed); setMobileOpen(false); }}
          className="hidden md:flex w-8 h-8 items-center justify-center rounded-lg text-[hsl(var(--dark-section-muted))] hover:text-[hsl(var(--dark-section-fg))] hover:bg-[hsl(var(--dark-section))]/50 transition-colors">
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
        <button onClick={() => setMobileOpen(false)} className="md:hidden text-[hsl(var(--dark-section-muted))]">
          <X className="w-5 h-5" />
        </button>
      </div>

      {!collapsed && (
        <div className="px-4 py-3">
          <p className="text-[10px] uppercase tracking-widest text-[hsl(var(--dark-section-muted))] font-semibold">Painel Admin</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.href;
          return (
            <button key={item.href} onClick={() => { navigate(item.href); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active ? "bg-primary text-primary-foreground" : "text-[hsl(var(--dark-section-muted))] hover:text-[hsl(var(--dark-section-fg))] hover:bg-[hsl(var(--dark-section))]/50"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-[hsl(var(--dark-section-border))]">
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[hsl(var(--dark-section-muted))] hover:text-destructive hover:bg-destructive/10 transition-all">
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile trigger */}
      <button onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] flex items-center justify-center text-[hsl(var(--dark-section-fg))]">
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setMobileOpen(false)}>
          <div className="w-64 h-full bg-[hsl(var(--dark-section-card))]" onClick={(e) => e.stopPropagation()}>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className={`hidden md:flex flex-col shrink-0 h-screen sticky top-0 bg-[hsl(var(--dark-section-card))] border-r border-[hsl(var(--dark-section-border))] transition-all duration-300 ${collapsed ? "w-[68px]" : "w-60"}`}>
        <SidebarContent />
      </aside>
    </>
  );
};

export default AdminSidebar;
