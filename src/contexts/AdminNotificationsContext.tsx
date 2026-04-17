import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { DbClient, DbPedido, DbServiceRecord } from "@/hooks/supabase/types";

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

  const addNotification = useCallback((notif: Omit<AdminNotification, "id" | "read" | "createdAt">) => {
    setNotifications((prev) => [
      {
        id: String(Date.now()) + Math.random().toString(36).slice(2),
        ...notif,
        read: false,
        createdAt: new Date(),
      },
      ...prev,
    ]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // PERF: consolidação dos 3 channels (pedidos / atendimentos / clients) em um
  // único channel reduz overhead de WebSocket e o número de subscriptions ativas.
  useEffect(() => {
    const channel = supabase
      .channel("realtime-admin-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "pedidos" },
        (payload) => {
          const pedido = payload.new as Partial<DbPedido>;
          addNotification({
            title: "Novo pedido recebido",
            message: `Pedido de ${pedido.cliente_email || "cliente"} — R$ ${Number(pedido.valor || 0).toFixed(2)}`,
            type: "success",
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "pedidos" },
        (payload) => {
          const pedido = payload.new as Partial<DbPedido>;
          if (pedido.status === "cancelado") {
            addNotification({
              title: "Pedido cancelado",
              message: `Pedido de ${pedido.cliente_email || "cliente"} foi cancelado.`,
              type: "warning",
            });
          } else if (pedido.status === "pago") {
            addNotification({
              title: "Pagamento confirmado",
              message: `Pedido de ${pedido.cliente_email || "cliente"} — R$ ${Number(pedido.valor || 0).toFixed(2)} pago.`,
              type: "success",
            });
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "service_records" },
        (payload) => {
          const record = payload.new as Partial<DbServiceRecord>;
          addNotification({
            title: "Novo atendimento registrado",
            message: `${record.type || "Atendimento"} por ${record.agent || "agente"}: ${(record.description || "").slice(0, 60)}`,
            type: "info",
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "clients" },
        (payload) => {
          const client = payload.new as Partial<DbClient>;
          addNotification({
            title: "Novo cliente cadastrado",
            message: `${client.name || "Cliente"} acabou de se cadastrar.`,
            type: "success",
          });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [addNotification]);

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