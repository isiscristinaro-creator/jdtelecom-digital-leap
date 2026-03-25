import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Wifi, LogOut, CreditCard, FileText, User, MessageCircle,
  Settings, CheckCircle, Clock, AlertTriangle, ChevronRight,
  Phone, Mail, MapPin, Zap, Calendar, DollarSign, Shield, ArrowUpRight,
  Bell, BellOff, Smartphone, Globe
} from "lucide-react";
import logo from "@/assets/logo.png";
import { toast } from "sonner";

const statusColors = {
  Pago: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Pendente: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Atrasado: "bg-red-500/10 text-red-400 border-red-500/20",
  Ativo: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Suspenso: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Cancelado: "bg-red-500/10 text-red-400 border-red-500/20",
};

const statusIcons = {
  Pago: CheckCircle,
  Pendente: Clock,
  Atrasado: AlertTriangle,
  Ativo: CheckCircle,
  Suspenso: Clock,
  Cancelado: AlertTriangle,
};

const SubscriberDashboard = () => {
  const { subscriber, isAuthenticated, logout, updateSubscriber } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: "", phone: "", address: "" });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/assinante", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (subscriber) {
      setEditData({ name: subscriber.name, phone: subscriber.phone, address: subscriber.address });
    }
  }, [subscriber]);

  if (!subscriber) return null;

  const handleLogout = () => {
    logout();
    navigate("/assinante", { replace: true });
  };

  const handleSaveEdit = () => {
    updateSubscriber(editData);
    setEditMode(false);
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const Icon = statusIcons[status as keyof typeof statusIcons] || CheckCircle;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${statusColors[status as keyof typeof statusColors] || ""}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-4 sm:p-5 md:p-6 ${className}`}>
      {children}
    </div>
  );

  const CardHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))]">{title}</h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-[hsl(var(--dark-section))] overflow-x-hidden">
      {/* Header */}
      <header className="bg-[hsl(var(--dark-section-card))] border-b border-[hsl(var(--dark-section-border))] sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-5 h-16 flex items-center justify-between max-w-full min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <a href="/">
              <img src={logo} alt="JD Telecom" className="h-8 brightness-0 invert" />
            </a>
            <span className="hidden sm:inline text-xs text-[hsl(var(--dark-section-muted))]">|</span>
            <span className="hidden sm:inline text-xs font-medium text-primary">Área do Assinante</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden md:inline text-sm text-[hsl(var(--dark-section-muted))]">{subscriber.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-[hsl(var(--dark-section-muted))] hover:text-destructive hover:bg-destructive/10 rounded-xl px-2 sm:px-3"
            >
              <LogOut className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-5 md:px-6 py-6 md:py-10 pb-28 max-w-6xl min-w-0">
        {/* Greeting with Avatar */}
        <div className="mb-8 flex items-center gap-4">
          <img
            src={subscriber.avatar}
            alt={subscriber.name}
            className="w-14 h-14 rounded-full border-2 border-primary/30 bg-[hsl(var(--dark-section-card))]"
          />
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-[hsl(var(--dark-section-fg))]">
              Olá, {subscriber.name.split(" ")[0]} 👋
            </h1>
            <p className="text-sm text-[hsl(var(--dark-section-muted))] mt-0.5">
              Seja bem-vindo à sua área do assinante
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-5 min-w-0">
            {/* Plan card */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-8 translate-x-8" />
              <CardHeader icon={Wifi} title="Meu Plano" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-display text-xl sm:text-2xl font-bold text-[hsl(var(--dark-section-fg))]">
                    {subscriber.plan.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
                    <div className="flex items-center gap-1.5 text-sm text-[hsl(var(--dark-section-muted))]">
                      <Zap className="w-4 h-4 text-primary" />
                      {subscriber.plan.speed}
                    </div>
                    <StatusBadge status={subscriber.plan.status} />
                  </div>
                </div>
                <div className="sm:text-right">
                  <p className="text-xs text-[hsl(var(--dark-section-muted))]">Valor mensal</p>
                  <p className="font-display text-2xl font-extrabold text-primary">{subscriber.plan.price}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[hsl(var(--dark-section-border))]">
                <Button
                  size="sm"
                  className="w-full sm:w-auto bg-primary/10 text-primary hover:bg-primary/20 font-bold rounded-xl whitespace-normal text-xs sm:text-sm leading-tight h-auto min-h-10 py-2"
                  onClick={() => toast.info("Funcionalidade de troca de plano será disponibilizada em breve.")}
                >
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  Trocar de plano
                </Button>
              </div>
            </Card>

            {/* Billing card */}
            <Card>
              <CardHeader icon={CreditCard} title="Faturamento" />
              <div className="flex flex-col gap-3 bg-[hsl(var(--dark-section))]/50 rounded-xl p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[hsl(var(--dark-section-fg))]">
                    Próxima fatura — {subscriber.billing.nextDue}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="flex items-center gap-1.5 text-xs text-[hsl(var(--dark-section-muted))]">
                      <Calendar className="w-3.5 h-3.5" />
                      Vencimento: {subscriber.billing.dueDate}
                    </span>
                    <StatusBadge status={subscriber.billing.status} />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[hsl(var(--dark-section-border))]/50">
                  <p className="font-display text-xl font-bold text-[hsl(var(--dark-section-fg))]">
                    {subscriber.billing.amount}
                  </p>
                  <Button
                    size="sm"
                    className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold"
                    onClick={() => toast.info("Funcionalidade de pagamento online será disponibilizada em breve.")}
                  >
                    Pagar agora
                  </Button>
                </div>
              </div>
            </Card>

            {/* Payment history */}
            <Card>
              <CardHeader icon={FileText} title="Histórico de Pagamentos" />
                <div className="overflow-x-auto -mx-1 px-1 [-webkit-overflow-scrolling:touch]">
                  <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="border-b border-[hsl(var(--dark-section-border))]">
                      <th className="text-left py-3 px-2 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider">Descrição</th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider">Data</th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider">Valor</th>
                      <th className="text-right py-3 px-2 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriber.history.map((item) => (
                      <tr key={item.id} className="border-b border-[hsl(var(--dark-section-border))]/50 hover:bg-[hsl(var(--dark-section))]/30 transition-colors">
                        <td className="py-3 px-2 text-[hsl(var(--dark-section-fg))]">{item.description}</td>
                        <td className="py-3 px-2 text-[hsl(var(--dark-section-muted))]">{item.date}</td>
                        <td className="py-3 px-2 text-[hsl(var(--dark-section-fg))] font-medium">{item.amount}</td>
                        <td className="py-3 px-2 text-right"><StatusBadge status={item.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-5 min-w-0">
            {/* Client data */}
            <Card>
              <CardHeader icon={User} title="Meus Dados" />
              {editMode ? (
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Nome</Label>
                    <Input
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] h-10 rounded-xl mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Telefone</Label>
                    <Input
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] h-10 rounded-xl mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Endereço</Label>
                    <Input
                      value={editData.address}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] h-10 rounded-xl mt-1"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button size="sm" onClick={handleSaveEdit} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl flex-1 font-bold">
                      Salvar
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditMode(false)} className="w-full sm:w-auto text-[hsl(var(--dark-section-muted))] rounded-xl">
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-[hsl(var(--dark-section-fg))]">{subscriber.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-[hsl(var(--dark-section-muted))] break-all">{subscriber.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-[hsl(var(--dark-section-muted))]">{subscriber.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-[hsl(var(--dark-section-muted))] break-words">{subscriber.address}</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setEditMode(true)}
                    className="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl h-10"
                  >
                    Editar dados
                  </Button>
                </div>
              )}
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader icon={Bell} title="Notificações" />
              <div className="space-y-3">
                {[
                  { label: "Email", icon: Mail, key: "notifications_email" as const },
                  { label: "SMS", icon: Smartphone, key: "notifications_sms" as const },
                  { label: "WhatsApp", icon: MessageCircle, key: "notifications_whatsapp" as const },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      const newVal = !subscriber.preferences[item.key];
                      updateSubscriber({
                        preferences: { ...subscriber.preferences, [item.key]: newVal },
                      });
                      toast.success(`${item.label} ${newVal ? "ativado" : "desativado"}`);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-[hsl(var(--dark-section))]/50 hover:bg-primary/5 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-primary" />
                      <span className="text-sm text-[hsl(var(--dark-section-fg))]">{item.label}</span>
                    </div>
                    <div className={`relative w-10 h-5 rounded-full transition-colors ${subscriber.preferences[item.key] ? "bg-primary" : "bg-[hsl(var(--dark-section-border))]"}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${subscriber.preferences[item.key] ? "translate-x-5" : "translate-x-0.5"}`} />
                    </div>
                  </button>
                ))}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[hsl(var(--dark-section))]/50">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="text-sm text-[hsl(var(--dark-section-fg))]">Idioma</span>
                  </div>
                  <span className="text-xs font-semibold text-[hsl(var(--dark-section-muted))]">
                    {subscriber.preferences.language === "pt-BR" ? "Português" : subscriber.preferences.language}
                  </span>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader icon={MessageCircle} title="Suporte" />
              <p className="text-xs text-[hsl(var(--dark-section-muted))] mb-4">
                Precisa de ajuda? Fale diretamente com nosso time de suporte.
              </p>
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl h-11"
                asChild
              >
                <a href="https://wa.me/558005945678" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Falar com suporte
                </a>
              </Button>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader icon={Settings} title="Serviços" />
              <div className="space-y-2">
                <button
                  onClick={() => toast.info("Funcionalidade de troca de plano será disponibilizada em breve.")}
                  className="flex items-center justify-between p-3 rounded-xl bg-[hsl(var(--dark-section))]/50 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all group w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-primary" />
                    <span className="text-sm text-[hsl(var(--dark-section-fg))]">Mudar de plano</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[hsl(var(--dark-section-muted))] group-hover:text-primary transition-colors" />
                </button>
                <a
                  href="https://wa.me/558005945678?text=Preciso%20de%20suporte%20t%C3%A9cnico"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[hsl(var(--dark-section))]/50 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all group text-left"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-sm text-[hsl(var(--dark-section-fg))]">Suporte técnico</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[hsl(var(--dark-section-muted))] group-hover:text-primary transition-colors" />
                </a>
                <button
                  onClick={() => toast.info("Funcionalidade de 2ª via será disponibilizada em breve.")}
                  className="flex items-center justify-between p-3 rounded-xl bg-[hsl(var(--dark-section))]/50 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all group w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="text-sm text-[hsl(var(--dark-section-fg))]">2ª via da fatura</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[hsl(var(--dark-section-muted))] group-hover:text-primary transition-colors" />
                </button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubscriberDashboard;
