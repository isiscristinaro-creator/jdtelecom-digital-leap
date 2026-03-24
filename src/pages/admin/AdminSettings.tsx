import { useState } from "react";
import { Bell, Settings, Wifi, WifiOff, Shield, Mail, MessageSquare, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminSettings = () => {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    companyName: "JD Telecom",
    email: "contato@jdtelecom.com",
    phone: "0800 594 5678",
    whatsapp: "0800 594 5678",
    address: "Manaus, AM - Brasil",
    notifyInadimplencia: true,
    notifyCancelamento: true,
    notifyNovosClientes: true,
    autoSuspend: true,
    suspendDays: "30",
    gracePeriod: "5",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-primary" : "bg-[hsl(var(--dark-section-border))]"}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : ""}`} />
    </button>
  );

  return (
    <div className="admin-page max-w-[900px] space-y-6 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[hsl(var(--dark-section-fg))]">Configurações</h1>
          <p className="text-sm text-[hsl(var(--dark-section-muted))] mt-1">Gerencie as configurações do sistema</p>
        </div>
        <Button onClick={handleSave} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold text-sm">
          {saved ? <><Check className="w-4 h-4 mr-2" /> Salvo!</> : <><Save className="w-4 h-4 mr-2" /> Salvar Alterações</>}
        </Button>
      </div>

      {/* Company info */}
      <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5 md:p-6 space-y-4">
        <h2 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" /> Dados da Empresa
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "Nome da Empresa", key: "companyName" as const },
            { label: "Email", key: "email" as const },
            { label: "Telefone", key: "phone" as const },
            { label: "WhatsApp", key: "whatsapp" as const },
          ].map(f => (
            <div key={f.key}>
              <Label className="text-xs text-[hsl(var(--dark-section-muted))]">{f.label}</Label>
              <Input value={settings[f.key]} onChange={e => setSettings({ ...settings, [f.key]: e.target.value })}
                className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] h-10 rounded-xl mt-1" />
            </div>
          ))}
          <div className="sm:col-span-2">
            <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Endereço</Label>
            <Input value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })}
              className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] h-10 rounded-xl mt-1" />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5 md:p-6 space-y-4">
        <h2 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" /> Notificações
        </h2>
        {[
          { label: "Alertar inadimplência", desc: "Receba notificações quando um cliente ficar inadimplente", key: "notifyInadimplencia" as const },
          { label: "Alertar cancelamentos", desc: "Receba notificações quando um cliente cancelar", key: "notifyCancelamento" as const },
          { label: "Novos clientes", desc: "Receba notificações de novos cadastros", key: "notifyNovosClientes" as const },
        ].map(item => (
          <div key={item.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
            <div>
              <p className="text-sm font-medium text-[hsl(var(--dark-section-fg))]">{item.label}</p>
              <p className="text-xs text-[hsl(var(--dark-section-muted))]">{item.desc}</p>
            </div>
            <Toggle checked={settings[item.key]} onChange={() => setSettings({ ...settings, [item.key]: !settings[item.key] })} />
          </div>
        ))}
      </div>

      {/* Billing rules */}
      <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5 md:p-6 space-y-4">
        <h2 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" /> Regras de Cobrança
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
          <div>
            <p className="text-sm font-medium text-[hsl(var(--dark-section-fg))]">Suspensão automática</p>
            <p className="text-xs text-[hsl(var(--dark-section-muted))]">Suspender automaticamente clientes inadimplentes</p>
          </div>
          <Toggle checked={settings.autoSuspend} onChange={() => setSettings({ ...settings, autoSuspend: !settings.autoSuspend })} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Dias para suspensão</Label>
            <Input type="number" value={settings.suspendDays} onChange={e => setSettings({ ...settings, suspendDays: e.target.value })}
              className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] h-10 rounded-xl mt-1" />
          </div>
          <div>
            <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Período de carência (dias)</Label>
            <Input type="number" value={settings.gracePeriod} onChange={e => setSettings({ ...settings, gracePeriod: e.target.value })}
              className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] h-10 rounded-xl mt-1" />
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminSettings;
