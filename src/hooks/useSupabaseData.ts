// Barrel re-export — mantém compatibilidade com imports existentes.
// Implementações reais ficam em src/hooks/supabase/*.

export type {
  DbPlan,
  DbClient,
  DbPayment,
  DbTeamMember,
  DbSystemLog,
  DbServiceRecord,
  DbProduto,
  DbPedido,
  DbBanner,
  DbTestemunho,
} from "./supabase/types";

export { usePlans } from "./supabase/usePlans";
export { useClients } from "./supabase/useClients";
export { usePayments } from "./supabase/usePayments";
export { useTeamMembers } from "./supabase/useTeamMembers";
export { useSystemLogs } from "./supabase/useSystemLogs";
export { useServiceRecords, useAllServiceRecords } from "./supabase/useServiceRecords";
export { useDashboardStats } from "./supabase/useDashboardStats";
export { useProdutos } from "./supabase/useProdutos";
export { usePedidos } from "./supabase/usePedidos";
export { useBanners } from "./supabase/useBanners";
export { useTestemunhos } from "./supabase/useTestemunhos";
export { uploadImage } from "./supabase/storage";
