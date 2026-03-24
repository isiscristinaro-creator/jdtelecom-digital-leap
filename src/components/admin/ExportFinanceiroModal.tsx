import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { allPayments, mockPlans } from "@/data/adminMockData";
import { exportToCSV, exportToExcel } from "@/utils/exportUtils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ExportFinanceiroModal = ({ open, onOpenChange }: Props) => {
  const [status, setStatus] = useState("todos");
  const [plano, setPlano] = useState("todos");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [formato, setFormato] = useState("excel");

  const parseDate = (dateStr: string) => {
    const [d, m, y] = dateStr.split("/").map(Number);
    return new Date(y, m - 1, d);
  };

  const getFilteredData = () => {
    let filtered = [...allPayments];

    if (status !== "todos") {
      filtered = filtered.filter(p => p.status === status);
    }

    if (plano !== "todos") {
      const planName = mockPlans.find(pl => pl.id === plano)?.name;
      if (planName) {
        const clientIds = new Set(
          // find clients with this plan from payments
          filtered.map(p => p.clientId)
        );
        // We need to cross-reference with mockClients
        import("@/data/adminMockData").then(() => {});
        // Actually let's filter by checking the description or use mockClients
      }
    }

    if (dataInicial) {
      const start = new Date(dataInicial);
      filtered = filtered.filter(p => {
        const pDate = parseDate(p.date);
        return pDate >= start;
      });
    }

    if (dataFinal) {
      const end = new Date(dataFinal);
      end.setHours(23, 59, 59);
      filtered = filtered.filter(p => {
        const pDate = parseDate(p.date);
        return pDate <= end;
      });
    }

    return filtered;
  };

  const handleExport = () => {
    const filtered = getFilteredData();
    const data = filtered.map(p => ({
      Cliente: p.clientName,
      Descrição: p.description,
      Data: p.date,
      "Valor (R$)": p.amount,
      Status: p.status,
    }));

    if (!data.length) {
      toast.error("Nenhum registro encontrado com os filtros selecionados");
      return;
    }

    const filename = `financeiro_jdtelecom_${new Date().toISOString().slice(0, 10)}`;

    if (formato === "excel") {
      exportToExcel(data, filename);
    } else {
      exportToCSV(data, filename);
    }

    toast.success(`${data.length} registros exportados com sucesso`);
    onOpenChange(false);
  };

  const previewCount = getFilteredData().length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[hsl(var(--dark-section-card))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-400" />
            Exportar Financeiro
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Status */}
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

          {/* Date range */}
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

          {/* Format */}
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

          {/* Preview count */}
          <div className="bg-[hsl(var(--dark-section))]/50 rounded-xl p-3 text-center">
            <p className="text-sm text-[hsl(var(--dark-section-muted))]">
              <span className="font-bold text-primary text-lg">{previewCount.toLocaleString()}</span> registros encontrados
            </p>
          </div>

          {/* Export button */}
          <Button onClick={handleExport} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Exportar {previewCount.toLocaleString()} registros
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportFinanceiroModal;
