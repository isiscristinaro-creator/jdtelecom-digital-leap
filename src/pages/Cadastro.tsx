import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { User, MessageCircle, Gauge, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import cadastroPerson from "@/assets/cadastro-person.png";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ESTADOS = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA",
  "PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO",
];

const PLANOS = [
  "400 MEGA - R$ 139,90/mês",
  "600 MEGA - R$ 179,90/mês",
  "800 MEGA - R$ 229,90/mês",
  "1000 MEGA - R$ 349,90/mês",
];

const VENCIMENTOS = ["5", "10", "15", "20", "25"];

function validarCPF(cpf: string) {
  const nums = cpf.replace(/\D/g, "");
  if (nums.length === 14) return nums.length === 14;
  if (nums.length !== 11 || /^(\d)\1+$/.test(nums)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(nums[i]) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  if (rest !== parseInt(nums[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(nums[i]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  return rest === parseInt(nums[10]);
}

function maskCPFCNPJ(v: string) {
  const nums = v.replace(/\D/g, "");
  if (nums.length <= 11) {
    return nums
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return nums
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function maskPhone(v: string) {
  const nums = v.replace(/\D/g, "").slice(0, 11);
  return nums
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function maskCEP(v: string) {
  const nums = v.replace(/\D/g, "").slice(0, 8);
  return nums.replace(/(\d{5})(\d)/, "$1-$2");
}

const Cadastro = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: "", email: "", cpfCnpj: "", nascimento: "", celular: "",
    cep: "", endereco: "", numero: "", bairro: "", cidade: "",
    estado: "", pontoReferencia: "", vencimento: "", plano: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = "Obrigatório";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email inválido";
    if (!validarCPF(form.cpfCnpj)) e.cpfCnpj = "CPF/CNPJ inválido";
    if (!form.nascimento) e.nascimento = "Obrigatório";
    if (form.celular.replace(/\D/g, "").length < 10) e.celular = "Celular inválido";
    if (form.cep.replace(/\D/g, "").length < 8) e.cep = "CEP inválido";
    if (!form.endereco.trim()) e.endereco = "Obrigatório";
    if (!form.numero.trim()) e.numero = "Obrigatório";
    if (!form.bairro.trim()) e.bairro = "Obrigatório";
    if (!form.cidade.trim()) e.cidade = "Obrigatório";
    if (!form.estado) e.estado = "Obrigatório";
    if (!form.vencimento) e.vencimento = "Obrigatório";
    if (!form.plano) e.plano = "Obrigatório";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Preencha todos os campos corretamente.");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    toast.success("Cadastro realizado com sucesso! Redirecionando...");
    setTimeout(() => navigate("/assinante"), 1500);
    setLoading(false);
  };

  const inputClass = (field: string) =>
    `h-12 bg-background border-border/40 rounded-lg px-4 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all ${errors[field] ? "border-destructive" : ""}`;

  const selectTriggerClass = (field: string) =>
    `h-12 bg-background border-border/40 rounded-lg px-4 text-sm ${errors[field] ? "border-destructive" : ""}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Spacer for fixed navbar */}
      <div className="pt-[108px] md:pt-[138px]" />

      {/* Header breadcrumb */}
      <div className="bg-primary py-5 px-4">
        <div className="max-w-[1140px] mx-auto flex items-center justify-between">
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary-foreground">Cadastro</h1>
          <div className="text-primary-foreground/80 text-xs">
            <a href="/" className="hover:text-primary-foreground transition-colors">Home</a>
            <span className="mx-1.5">›</span>
            <span>Cadastro</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center py-10 md:py-14">
        <motion.h2
          className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Estamos aqui para atender você!
        </motion.h2>
        <motion.p
          className="text-muted-foreground mt-2 text-sm md:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Preencha o formulário e comece a navegar com a JD Telecom
        </motion.p>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left - Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Dados Pessoais */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-5 bg-primary rounded-full" />
                  <h3 className="font-display text-base font-semibold text-foreground uppercase tracking-wide">Dados Pessoais</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nome Completo</Label>
                    <Input
                      placeholder="Seu nome completo"
                      value={form.nome}
                      onChange={e => set("nome", e.target.value)}
                      className={inputClass("nome")}
                    />
                    {errors.nome && <p className="text-xs text-destructive mt-1">{errors.nome}</p>}
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Endereço de Email</Label>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={form.email}
                      onChange={e => set("email", e.target.value)}
                      className={inputClass("email")}
                    />
                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">CPF/CNPJ</Label>
                      <Input
                        placeholder="000.000.000-00"
                        value={form.cpfCnpj}
                        onChange={e => set("cpfCnpj", maskCPFCNPJ(e.target.value))}
                        className={inputClass("cpfCnpj")}
                      />
                      {errors.cpfCnpj && <p className="text-xs text-destructive mt-1">{errors.cpfCnpj}</p>}
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Data de Nascimento</Label>
                      <Input
                        type="date"
                        value={form.nascimento}
                        onChange={e => set("nascimento", e.target.value)}
                        className={inputClass("nascimento")}
                      />
                      {errors.nascimento && <p className="text-xs text-destructive mt-1">{errors.nascimento}</p>}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Celular para Contato</Label>
                    <Input
                      placeholder="(00) 00000-0000"
                      value={form.celular}
                      onChange={e => set("celular", maskPhone(e.target.value))}
                      className={inputClass("celular")}
                    />
                    {errors.celular && <p className="text-xs text-destructive mt-1">{errors.celular}</p>}
                  </div>
                </div>
              </div>

              {/* Separator */}
              <div className="border-t border-border/30" />

              {/* Endereço */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-5 bg-primary rounded-full" />
                  <h3 className="font-display text-base font-semibold text-foreground uppercase tracking-wide">Endereço</h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">CEP</Label>
                      <Input
                        placeholder="00000-000"
                        value={form.cep}
                        onChange={e => set("cep", maskCEP(e.target.value))}
                        className={inputClass("cep")}
                      />
                      {errors.cep && <p className="text-xs text-destructive mt-1">{errors.cep}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Endereço</Label>
                      <Input
                        placeholder="Rua, Avenida..."
                        value={form.endereco}
                        onChange={e => set("endereco", e.target.value)}
                        className={inputClass("endereco")}
                      />
                      {errors.endereco && <p className="text-xs text-destructive mt-1">{errors.endereco}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Número</Label>
                      <Input
                        placeholder="Nº"
                        value={form.numero}
                        onChange={e => set("numero", e.target.value)}
                        className={inputClass("numero")}
                      />
                      {errors.numero && <p className="text-xs text-destructive mt-1">{errors.numero}</p>}
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Bairro</Label>
                      <Input
                        placeholder="Bairro"
                        value={form.bairro}
                        onChange={e => set("bairro", e.target.value)}
                        className={inputClass("bairro")}
                      />
                      {errors.bairro && <p className="text-xs text-destructive mt-1">{errors.bairro}</p>}
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Cidade</Label>
                      <Input
                        placeholder="Cidade"
                        value={form.cidade}
                        onChange={e => set("cidade", e.target.value)}
                        className={inputClass("cidade")}
                      />
                      {errors.cidade && <p className="text-xs text-destructive mt-1">{errors.cidade}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Estado</Label>
                      <Select value={form.estado} onValueChange={v => set("estado", v)}>
                        <SelectTrigger className={selectTriggerClass("estado")}>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {ESTADOS.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {errors.estado && <p className="text-xs text-destructive mt-1">{errors.estado}</p>}
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Ponto de Referência</Label>
                      <Input
                        placeholder="Próximo a..."
                        value={form.pontoReferencia}
                        onChange={e => set("pontoReferencia", e.target.value)}
                        className={inputClass("pontoReferencia")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Separator */}
              <div className="border-t border-border/30" />

              {/* Plano */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-5 bg-primary rounded-full" />
                  <h3 className="font-display text-base font-semibold text-foreground uppercase tracking-wide">Escolha seu Plano</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Data de Vencimento</Label>
                    <Select value={form.vencimento} onValueChange={v => set("vencimento", v)}>
                      <SelectTrigger className={selectTriggerClass("vencimento")}>
                        <SelectValue placeholder="Selecione o dia" />
                      </SelectTrigger>
                      <SelectContent>
                        {VENCIMENTOS.map(d => <SelectItem key={d} value={d}>Dia {d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {errors.vencimento && <p className="text-xs text-destructive mt-1">{errors.vencimento}</p>}
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Plano</Label>
                    <Select value={form.plano} onValueChange={v => set("plano", v)}>
                      <SelectTrigger className={selectTriggerClass("plano")}>
                        <SelectValue placeholder="Selecione o plano" />
                      </SelectTrigger>
                      <SelectContent>
                        {PLANOS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {errors.plano && <p className="text-xs text-destructive mt-1">{errors.plano}</p>}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 font-bold text-sm rounded-xl uppercase tracking-widest transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
              >
                {loading ? "Processando..." : "Finalizar Cadastro"}
              </Button>
            </form>
          </motion.div>

          {/* Right - Actions + Image */}
          <motion.div
            className="lg:col-span-2 space-y-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {[
              { href: "/assinante", icon: User, title: "Área do Cliente", desc: "Acesse para visualizar sua fatura", external: false },
              { href: "https://wa.me/5592991234567?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20minha%20fatura.", icon: MessageCircle, title: "Fatura via WhatsApp", desc: "Solicite sua fatura", external: true },
              { href: "https://www.speedtest.net/", icon: Gauge, title: "Teste de Velocidade", desc: "Confira sua velocidade", external: true },
            ].map(({ href, icon: Icon, title, desc, external }) => (
              <a
                key={title}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-center gap-4 bg-primary text-primary-foreground rounded-xl p-5 hover:bg-primary/90 hover:shadow-md transition-all group"
              >
                <div className="bg-primary-foreground/20 rounded-lg p-3 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm uppercase tracking-wide">{title}</p>
                  <p className="text-xs text-primary-foreground/80">{desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
              </a>
            ))}

            <div className="hidden lg:flex justify-center pt-6">
              <img
                src={cadastroPerson}
                alt="Pessoa usando dispositivo móvel"
                className="max-w-[300px] w-full object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
