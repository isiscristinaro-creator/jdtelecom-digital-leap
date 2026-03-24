import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { allPayments, mockClients, mockPlans } from "@/data/adminMockData";
import { exportToCSV, exportToExcel } from "@/utils/exportUtils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ExportFinanceiroModal = ({ open, onOpenChange }: Props) => {
  const [status, setStatus] = useState("todos");
  const [cliente, setCliente] = useState("todos");
  const [plano, setPlano] = useState("todos");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [formato, setFormato] = useState("excel");

  const clientById = useMemo(() => {
    return new Map(mockClients.map((client) => [client.id, client]));
  }, []);

  const clientOptions = useMemo(() => {
    const seen = new Set<string>();
    return allPayments
      .map((payment) => ({ id: payment.clientId, name: payment.clientName }))
      .filter((clientOption) => {
        if (seen.has(clientOption.id)) return false;
        seen.add(clientOption.id);
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  }, []);

  const parseDate = (dateStr: string) => {
    const [d, m, y] = dateStr.split("/").map(Number);
    return new Date(y, m - 1, d);
  };

  const parseInputDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const filteredData = useMemo(() => {
    let filtered = [...allPayments];

    if (status !== "todos") {
      filtered = filtered.filter(p => p.status === status);
    }

    if (cliente !== "todos") {
      filtered = filtered.filter((payment) => payment.clientId === cliente);
    }

    if (plano !== "todos") {
      filtered = filtered.filter((payment) => clientById.get(payment.clientId)?.plan === plano);
    }

    if (dataInicial) {
      const start = parseInputDate(dataInicial);
      filtered = filtered.filter(p => parseDate(p.date) >= start);
    }

    if (dataFinal) {
      const end = parseInputDate(dataFinal);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(p => parseDate(p.date) <= end);
    }

    return filtered;
  }, [status, cliente, plano, dataInicial, dataFinal, clientById]);

  const handleExport = () => {
    const data = filteredData.map(p => ({
      Nome: p.clientName,
      Email: clientById.get(p.clientId)?.email ?? "-",
      Plano: clientById.get(p.clientId)?.plan ?? "-",
      Status: p.status,
      "Valor (R$)": p.amount,
      Data: p.date,
      "Descrição": p.description,
    }));

    if (!data.length) {
      toast.error("Nenhum dado disponível para exportação");
      return;
    }

    const filename = `relatorio-financeiro-${new Date().toISOString().slice(0, 10)}`;

    if (formato === "excel") {
      exportToExcel(data, filename, { reportTitle: "JD Telecom", reportSubtitle: "Relatório Financeiro" });
    } else {
      exportToCSV(data, filename);
    }

    toast.success(`${data.length} registros exportados com sucesso`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[hsl(var(--dark-section-card))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Exportar Financeiro
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="bg-[hsl(var(--dark-section))]/50 border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[hsl(var(--dark-section-card))] border-[hsl(var(--dark-section-border))]">
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Pago">Pago</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Atrasado">Atrasado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Cliente</Label>
              <Select value={cliente} onValueChange={setCliente}>
                <SelectTrigger className="bg-[hsl(var(--dark-section))]/50 border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(var(--dark-section-card))] border-[hsl(var(--dark-section-border))] max-h-60">
                  <SelectItem value="todos">Todos</SelectItem>
                  {clientOptions.map((clientOption) => (
                    <SelectItem key={clientOption.id} value={clientOption.id}>{clientOption.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Plano</Label>
              <Select value={plano} onValueChange={setPlano}>
                <SelectTrigger className="bg-[hsl(var(--dark-section))]/50 border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(var(--dark-section-card))] border-[hsl(var(--dark-section-border))]">
                  <SelectItem value="todos">Todos</SelectItem>
                  {mockPlans.map((planOption) => (
                    <SelectItem key={planOption.id} value={planOption.name}>{planOption.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Data Inicial</Label>
              <Input type="date" value={dataInicial} onChange={e => setDataInicial(e.target.value)}
                className="bg-[hsl(var(--dark-section))]/50 border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))]" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Data Final</Label>
              <Input type="date" value={dataFinal} onChange={e => setDataFinal(e.target.value)}
                className="bg-[hsl(var(--dark-section))]/50 border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Formato</Label>
            <Select value={formato} onValueChange={setFormato}>
              <SelectTrigger className="bg-[hsl(var(--dark-section))]/50 border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[hsl(var(--dark-section-card))] border-[hsl(var(--dark-section-border))]">
                <SelectItem value="excel">Excel (.xls)</SelectItem>
                <SelectItem value="csv">CSV (.csv)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-[hsl(var(--dark-section))]/50 rounded-xl p-3 text-center">
            <p className="text-sm text-[hsl(var(--dark-section-muted))]">
              <span className="font-bold text-primary text-lg">{filteredData.length.toLocaleString()}</span> registros encontrados
            </p>
          </div>

          <Button onClick={handleExport} disabled={!filteredData.length} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl disabled:opacity-60">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Exportar {filteredData.length.toLocaleString()} registros
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportFinanceiroModal;
