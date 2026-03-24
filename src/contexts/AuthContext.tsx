import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  plan: {
    name: string;
    speed: string;
    status: "Ativo" | "Suspenso" | "Cancelado";
    price: string;
  };
  billing: {
    nextDue: string;
    dueDate: string;
    status: "Pago" | "Pendente";
    amount: string;
  };
  history: Array<{
    id: string;
    date: string;
    amount: string;
    status: "Pago" | "Pendente" | "Atrasado";
    description: string;
  }>;
}

interface AuthContextType {
  subscriber: Subscriber | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateSubscriber: (data: Partial<Subscriber>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_SUBSCRIBER: Subscriber = {
  id: "1",
  name: "João Silva",
  email: "teste@jdtelecom.com",
  phone: "(92) 99123-4567",
  address: "Rua das Flores, 123 - Manaus, AM",
  plan: {
    name: "Turbo Fibra 300",
    speed: "300MB Fibra",
    status: "Ativo",
    price: "R$ 139,90",
  },
  billing: {
    nextDue: "Abril 2026",
    dueDate: "15/04/2026",
    status: "Pendente",
    amount: "R$ 139,90",
  },
  history: [
    { id: "1", date: "15/03/2026", amount: "R$ 139,90", status: "Pago", description: "Mensalidade Março" },
    { id: "2", date: "15/02/2026", amount: "R$ 139,90", status: "Pago", description: "Mensalidade Fevereiro" },
    { id: "3", date: "15/01/2026", amount: "R$ 139,90", status: "Pago", description: "Mensalidade Janeiro" },
    { id: "4", date: "15/12/2025", amount: "R$ 139,90", status: "Pago", description: "Mensalidade Dezembro" },
    { id: "5", date: "15/11/2025", amount: "R$ 129,90", status: "Pago", description: "Mensalidade Novembro" },
    { id: "6", date: "15/10/2025", amount: "R$ 129,90", status: "Atrasado", description: "Mensalidade Outubro" },
  ],
};

const SESSION_KEY = "jd_subscriber_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        setSubscriber(JSON.parse(saved));
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800));
    if (email === "teste@jdtelecom.com" && password === "123456") {
      setSubscriber(MOCK_SUBSCRIBER);
      localStorage.setItem(SESSION_KEY, JSON.stringify(MOCK_SUBSCRIBER));
      return true;
    }
    return false;
  };

  const logout = () => {
    setSubscriber(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateSubscriber = (data: Partial<Subscriber>) => {
    if (!subscriber) return;
    const updated = { ...subscriber, ...data };
    setSubscriber(updated);
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ subscriber, isAuthenticated: !!subscriber, login, logout, updateSubscriber }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
