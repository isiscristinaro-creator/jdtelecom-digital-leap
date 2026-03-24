export interface ServiceRecord {
  id: string;
  clientId: string;
  date: string;
  agent: string;
  type: "Suporte Técnico" | "Financeiro" | "Comercial";
  description: string;
}

const descriptions: Record<ServiceRecord["type"], string[]> = {
  "Suporte Técnico": [
    "Cliente relatou lentidão na conexão. Realizado reset do roteador remotamente.",
    "Troca de equipamento ONU solicitada. Técnico agendado.",
    "Configuração de Wi-Fi realizada via acesso remoto.",
    "Verificação de sinal óptico. Dentro dos parâmetros normais.",
  ],
  Financeiro: [
    "Cliente solicitou segunda via do boleto.",
    "Negociação de débito pendente. Parcelamento em 3x aprovado.",
    "Atualização de dados de pagamento.",
    "Contestação de cobrança resolvida.",
  ],
  Comercial: [
    "Cliente interessado em upgrade de plano.",
    "Apresentação dos novos planos com TV PLUS.",
    "Renovação de contrato por mais 12 meses.",
    "Oferta de plano empresarial apresentada.",
  ],
};

const agents = ["Carlos Atendimento", "Ana Financeiro", "Roberto Comercial", "Fernanda Operação"];

export function generateServiceHistory(clientId: string, count: number = 5): ServiceRecord[] {
  const types: ServiceRecord["type"][] = ["Suporte Técnico", "Financeiro", "Comercial"];
  const records: ServiceRecord[] = [];
  for (let i = 0; i < count; i++) {
    const type = types[i % types.length];
    const d = new Date();
    d.setDate(d.getDate() - i * 7);
    records.push({
      id: `srv-${clientId}-${i}`,
      clientId,
      date: `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`,
      agent: agents[i % agents.length],
      type,
      description: descriptions[type][i % descriptions[type].length],
    });
  }
  return records;
}
