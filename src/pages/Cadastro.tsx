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
  if (nums.length === 14) return nums.length === 14; // CNPJ basic
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

  const Field = ({ label, field, type = "text", mask, placeholder }: {
    label: string; field: string; type?: string; mask?: (v: string) => string; placeholder?: string;
  }) => (
    <div className="space-y-1">
      <Label className="text-xs font-medium text-foreground/70">{label}</Label>
      <Input
        type={type}
        placeholder={placeholder || label}
        value={(form as any)[field]}
        onChange={e => set(field, mask ? mask(e.target.value) : e.target.value)}
        className={`bg-background border-border/50 focus:border-primary ${errors[field] ? "border-destructive" : ""}`}
      />
      {errors[field] && <p className="text-xs text-destructive">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary py-6 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground">Cadastro</h1>
          <div className="text-primary-foreground/80 text-sm">
            <a href="/" className="hover:text-primary-foreground transition-colors">home</a>
            <span className="mx-1">›</span>
            <span>Cadastro</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center py-10 md:py-14">
        <motion.h2
          className="font-display text-2xl md:text-4xl font-bold text-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Estamos aqui para atender você!
        </motion.h2>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left - Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-display text-lg font-bold text-foreground mb-1">Faça seu cadastro pelo formulário</h3>
            <p className="text-sm text-muted-foreground mb-6">Cadastre-se através do formulário abaixo:</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Nome Completo" field="nome" placeholder="Nome Completo" />
              <Field label="Endereço de Email" field="email" type="email" placeholder="Endereço de Email" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="CPF/CNPJ" field="cpfCnpj" mask={maskCPFCNPJ} placeholder="CPF/CNPJ" />
                <Field label="Data de Nascimento" field="nascimento" type="date" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Celular para Contato" field="celular" mask={maskPhone} placeholder="(00) 00000-0000" />
                <Field label="CEP" field="cep" mask={maskCEP} placeholder="00000-000" />
              </div>

              <Field label="Endereço" field="endereco" placeholder="Endereço" />
              <Field label="Ponto de Referência" field="pontoReferencia" placeholder="Ponto de Referência" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Número" field="numero" placeholder="Número" />
                <Field label="Bairro" field="bairro" placeholder="Bairro" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Cidade" field="cidade" placeholder="Cidade" />
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-foreground/70">Estado</Label>
                  <Select value={form.estado} onValueChange={v => set("estado", v)}>
                    <SelectTrigger className={`bg-background border-border/50 ${errors.estado ? "border-destructive" : ""}`}>
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTADOS.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.estado && <p className="text-xs text-destructive">{errors.estado}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-foreground/70">Data de Vencimento</Label>
                  <Select value={form.vencimento} onValueChange={v => set("vencimento", v)}>
                    <SelectTrigger className={`bg-background border-border/50 ${errors.vencimento ? "border-destructive" : ""}`}>
                      <SelectValue placeholder="Data de Vencimento" />
                    </SelectTrigger>
                    <SelectContent>
                      {VENCIMENTOS.map(d => <SelectItem key={d} value={d}>Dia {d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.vencimento && <p className="text-xs text-destructive">{errors.vencimento}</p>}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-foreground/70">Escolha o Plano</Label>
                  <Select value={form.plano} onValueChange={v => set("plano", v)}>
                    <SelectTrigger className={`bg-background border-border/50 ${errors.plano ? "border-destructive" : ""}`}>
                      <SelectValue placeholder="Escolha o Plano" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLANOS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.plano && <p className="text-xs text-destructive">{errors.plano}</p>}
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-foreground text-background hover:bg-foreground/90 font-bold text-sm py-6 rounded-xl uppercase tracking-wider"
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
            {/* Card 1 - Área do Cliente */}
            <a
              href="/assinante"
              className="flex items-center gap-4 bg-primary text-primary-foreground rounded-xl p-5 hover:bg-primary/90 transition-colors group"
            >
              <div className="bg-primary-foreground/20 rounded-lg p-3">
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm uppercase tracking-wide">Área do Cliente</p>
                <p className="text-xs text-primary-foreground/80">Acesse para visualizar sua fatura</p>
              </div>
              <ChevronRight className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>

            {/* Card 2 - Fatura via WhatsApp */}
            <a
              href="https://wa.me/5592991234567?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20minha%20fatura."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-primary text-primary-foreground rounded-xl p-5 hover:bg-primary/90 transition-colors group"
            >
              <div className="bg-primary-foreground/20 rounded-lg p-3">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm uppercase tracking-wide">Fatura via WhatsApp</p>
                <p className="text-xs text-primary-foreground/80">Solicite sua fatura</p>
              </div>
              <ChevronRight className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>

            {/* Card 3 - Teste de Velocidade */}
            <a
              href="https://www.speedtest.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-primary text-primary-foreground rounded-xl p-5 hover:bg-primary/90 transition-colors group"
            >
              <div className="bg-primary-foreground/20 rounded-lg p-3">
                <Gauge className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm uppercase tracking-wide">Teste de Velocidade</p>
                <p className="text-xs text-primary-foreground/80">Confira sua velocidade</p>
              </div>
              <ChevronRight className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>

            {/* Image */}
            <div className="hidden lg:flex justify-center pt-4">
              <img
                src={cadastroPerson}
                alt="Pessoa usando dispositivo móvel"
                className="max-w-[320px] w-full object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
