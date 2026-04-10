import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "danger" | "success";
  read: boolean;
  createdAt: Date;
}

interface AdminNotificationsContextType {
  notifications: AdminNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
}

const AdminNotificationsContext = createContext<AdminNotificationsContextType | null>(null);

const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "1",
    title: "Pagamento atrasado",
    message: "Camila Oliveira está com pagamento atrasado há 15 dias.",
    type: "danger",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 10),
  },
  {
    id: "2",
    title: "Novo cliente cadastrado",
    message: "Lucas Ferreira assinou o plano Turbo Fibra 500.",
    type: "success",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: "3",
    title: "Cancelamento solicitado",
    message: "Patricia Melo solicitou cancelamento do plano.",
    type: "warning",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120),
  },
  {
    id: "4",
    title: "Meta mensal atingida",
    message: "Parabéns! A meta de 50 novos clientes foi atingida.",
    type: "info",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: "5",
    title: "Manutenção programada",
    message: "Manutenção na rede de fibra no setor Norte amanhã às 02h.",
    type: "info",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

export function AdminNotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AdminNotification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Simulate a new notification every 2 minutes
  useEffect(() => {
    const messages = [
      { title: "Novo pagamento recebido", message: "André Lima pagou R$ 349,90.", type: "success" as const },
      { title: "Alerta de inadimplência", message: "3 novos clientes inadimplentes detectados.", type: "warning" as const },
      { title: "Chamado de suporte", message: "Novo chamado técnico aberto por Roberto Almeida.", type: "info" as const },
    ];
    const timer = setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      setNotifications((prev) => [
        {
          id: String(Date.now()),
          ...msg,
          read: false,
          createdAt: new Date(),
        },
        ...prev,
      ]);
    }, 120000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AdminNotificationsContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, dismissNotification }}>
      {children}
    </AdminNotificationsContext.Provider>
  );
}

export function useAdminNotifications() {
  const ctx = useContext(AdminNotificationsContext);
  if (!ctx) throw new Error("useAdminNotifications must be used within AdminNotificationsProvider");
  return ctx;
}
