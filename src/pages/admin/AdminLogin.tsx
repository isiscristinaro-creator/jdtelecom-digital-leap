import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate("/admin/dashboard", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) { setError("Preencha todos os campos."); return; }
    setLoading(true);
    const success = await login(email.trim(), password);
    setLoading(false);
    if (success) navigate("/admin/dashboard", { replace: true });
    else setError("Credenciais inválidas.");
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--dark-section))] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <a href="/"><img src={logo} alt="JD Telecom" className="h-12 mx-auto brightness-0 invert mb-4" /></a>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-primary" />
            <h1 className="font-display text-xl font-bold text-[hsl(var(--dark-section-fg))]">Painel Administrativo</h1>
          </div>
          <p className="text-sm text-[hsl(var(--dark-section-muted))]">Acesso restrito à equipe de gestão</p>
        </div>

        <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-6 md:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-sm font-medium text-[hsl(var(--dark-section-fg))]">Email</Label>
              <Input id="admin-email" type="email" placeholder="admin@jdtelecom.com" value={email} onChange={(e) => setEmail(e.target.value)}
                className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] placeholder:text-[hsl(var(--dark-section-muted))] h-12 rounded-xl focus:border-primary" autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-sm font-medium text-[hsl(var(--dark-section-fg))]">Senha</Label>
              <div className="relative">
                <Input id="admin-password" type={showPassword ? "text" : "password"} placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] placeholder:text-[hsl(var(--dark-section-muted))] h-12 rounded-xl pr-12 focus:border-primary" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--dark-section-muted))] hover:text-[hsl(var(--dark-section-fg))]">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm rounded-xl">
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Entrando...</> : "Entrar"}
            </Button>
          </form>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-xs text-[hsl(var(--dark-section-muted))] hover:text-[hsl(var(--dark-section-fg))] transition-colors">← Voltar ao site</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
