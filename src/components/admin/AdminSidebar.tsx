import { useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useAdminNotifications } from "@/contexts/AdminNotificationsContext";
import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard, Users, Package, CreditCard, BarChart3, LogOut, Menu, X, ChevronLeft, Settings, UsersRound, ScrollText, Shield, Bell, CheckCheck, Trash2
  , ShoppingBag, Image, MessageSquare, ClipboardList, Headphones
} from "lucide-react";
import logo from "@/assets/logo.png";

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  gerente: "Gerente",
  atendimento: "Atendimento",
};

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Clientes", href: "/admin/clientes", icon: Users },
  { label: "Planos", href: "/admin/planos", icon: Package },
  { label: "Pagamentos", href: "/admin/pagamentos", icon: CreditCard },
  { label: "Relatórios", href: "/admin/relatorios", icon: BarChart3 },
  { label: "Equipe", href: "/admin/equipe", icon: UsersRound },
  { label: "Logs", href: "/admin/logs", icon: ScrollText },
  { label: "Produtos", href: "/admin/produtos", icon: ShoppingBag },
  { label: "Pedidos", href: "/admin/pedidos", icon: ClipboardList },
  { label: "Banners", href: "/admin/banners", icon: Image },
  { label: "Testemunhos", href: "/admin/testemunhos", icon: MessageSquare },
  { label: "Atendimentos", href: "/admin/atendimentos", icon: Headphones },
  { label: "Configurações", href: "/admin/configuracoes", icon: Settings },
];

const typeColors: Record<string, string> = {
  info: "bg-blue-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  success: "bg-emerald-500",
};


function timeAgo(date: Date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "agora";
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, admin } = useAdminAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, dismissNotification } = useAdminNotifications();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notifOpen]);

  const handleLogout = () => { logout(); navigate("/admin", { replace: true }); };

  const NotificationBell = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="relative" ref={isMobile ? undefined : notifRef}>
      <button
        onClick={() => setNotifOpen(!notifOpen)}
        className="relative w-10 h-10 flex items-center justify-center rounded-xl text-[hsl(var(--dark-section-muted))] hover:text-[hsl(var(--dark-section-fg))] hover:bg-[hsl(var(--dark-section))]/50 transition-colors"
        title="Notificações"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1 animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {notifOpen && (
        <div className={`absolute z-50 ${isMobile ? "left-0" : collapsed ? "left-full ml-2" : "left-0"} bottom-full mb-2 w-80 max-h-[420px] bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl shadow-2xl overflow-hidden flex flex-col`}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--dark-section-border))]">
            <h3 className="text-sm font-bold text-[hsl(var(--dark-section-fg))]">Notificações</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 font-semibold">
                <CheckCheck className="w-3 h-3" /> Marcar todas como lidas
              </button>
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-[hsl(var(--dark-section-muted))]">
                Nenhuma notificação
              </div>
            ) : (
              notifications.slice(0, 10).map((n) => (
                <div
                  key={n.id}
                  className={`group flex items-start gap-3 px-4 py-3 border-b border-[hsl(var(--dark-section-border))]/50 transition-colors cursor-pointer hover:bg-[hsl(var(--dark-section))]/30 ${!n.read ? "bg-primary/5" : ""}`}
                  onClick={() => markAsRead(n.id)}
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${typeColors[n.type]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs font-semibold truncate ${!n.read ? "text-[hsl(var(--dark-section-fg))]" : "text-[hsl(var(--dark-section-muted))]"}`}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-[hsl(var(--dark-section-muted))] shrink-0">{timeAgo(n.createdAt)}</span>
                    </div>
                    <p className="text-[11px] text-[hsl(var(--dark-section-muted))] mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); dismissNotification(n.id); }}
                    className="opacity-0 group-hover:opacity-100 shrink-0 mt-0.5 text-[hsl(var(--dark-section-muted))] hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );

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

      {/* Bottom section */}
      <div className="p-3 border-t border-[hsl(var(--dark-section-border))] space-y-2">
        {/* Notification bell */}
        <div className="flex items-center justify-center">
          <NotificationBell />
        </div>

        {!collapsed && admin && (
          <div className="px-3 py-2 rounded-xl bg-[hsl(var(--dark-section))]/50">
            <p className="text-xs font-semibold text-[hsl(var(--dark-section-fg))] truncate">{admin.name}</p>
            <p className="text-[10px] text-[hsl(var(--dark-section-muted))] truncate">{admin.email}</p>
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
              <Shield className="w-2.5 h-2.5" /> {roleLabels[admin.role] || admin.role}
            </span>
          </div>
        )}
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
      {!mobileOpen && (
        <button onClick={() => setMobileOpen(true)}
          className="md:hidden fixed top-[calc(0.75rem+env(safe-area-inset-top))] left-3 z-50 w-10 h-10 rounded-xl bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] flex items-center justify-center text-[hsl(var(--dark-section-fg))] shadow-lg">
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setMobileOpen(false)}>
          <div className="w-[82vw] max-w-72 h-full bg-[hsl(var(--dark-section-card))] shadow-elevated" onClick={(e) => e.stopPropagation()}>
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
