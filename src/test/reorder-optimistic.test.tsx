/**
 * Testes para o estado otimista do reorder.
 *
 * Garantia: enquanto as Promises de update do supabase estão PENDENTES,
 * o estado da lista (plans/banners/testemunhos/produtos) já reflete a
 * nova ordem solicitada — sem esperar resposta do servidor.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";

const toastError = vi.fn();
const toastSuccess = vi.fn();
vi.mock("sonner", () => ({
  toast: { error: (...a: any[]) => toastError(...a), success: (...a: any[]) => toastSuccess(...a) },
}));

// Cada update retorna uma Promise pendente até que resolveAllUpdates() seja chamado.
let pendingResolvers: Array<(v: { error: any }) => void> = [];
let selectResults: Record<string, any[]> = {};

function makeSupabaseMock() {
  return {
    from: (table: string) => ({
      select: () => ({
        order: () => ({
          order: () => Promise.resolve({ data: selectResults[table] ?? [], error: null }),
        }),
      }),
      update: (_values: any) => ({
        eq: (_col: string, _id: string) => {
          return new Promise<{ error: any }>((resolve) => {
            pendingResolvers.push(resolve);
          });
        },
      }),
    }),
  };
}

vi.mock("@/integrations/supabase/client", () => ({
  supabase: makeSupabaseMock(),
}));

import { usePlans } from "@/hooks/supabase/usePlans";
import { useBanners } from "@/hooks/supabase/useBanners";
import { useTestemunhos } from "@/hooks/supabase/useTestemunhos";
import { useProdutos } from "@/hooks/supabase/useProdutos";

const HOOKS = [
  { name: "usePlans", hook: usePlans, listKey: "plans" as const, table: "plans" },
  { name: "useBanners", hook: useBanners, listKey: "banners" as const, table: "banners" },
  { name: "useTestemunhos", hook: useTestemunhos, listKey: "testemunhos" as const, table: "testemunhos" },
  { name: "useProdutos", hook: useProdutos, listKey: "produtos" as const, table: "produtos" },
];

beforeEach(() => {
  toastError.mockClear();
  toastSuccess.mockClear();
  pendingResolvers = [];
  selectResults = {
    plans: [{ id: "p1" }, { id: "p2" }, { id: "p3" }],
    banners: [{ id: "b1" }, { id: "b2" }, { id: "b3" }],
    testemunhos: [{ id: "t1" }, { id: "t2" }, { id: "t3" }],
    produtos: [{ id: "x1" }, { id: "x2" }, { id: "x3" }],
  };
});

function resolveAllUpdates() {
  pendingResolvers.forEach((r) => r({ error: null }));
  pendingResolvers = [];
}

describe.each(HOOKS)("$name reorder otimista", ({ hook, listKey }) => {
  it("UI reflete nova ordem ANTES das Promises do supabase resolverem", async () => {
    const { result } = renderHook(() => hook() as any);
    await waitFor(() => expect(result.current.loading).toBe(false));

    const initialIds = (result.current[listKey] as Array<{ id: string }>).map((i) => i.id);
    const reversed = [...initialIds].reverse();

    // Dispara o reorder mas NÃO aguarda — mantém promises pendentes.
    let reorderPromise!: Promise<boolean>;
    act(() => {
      reorderPromise = result.current.reorder(reversed);
    });

    // Neste ponto, as Promises de update ainda estão pendentes,
    // mas o setState otimista já deve ter rodado.
    await waitFor(() => {
      const currentIds = (result.current[listKey] as Array<{ id: string }>).map((i) => i.id);
      expect(currentIds).toEqual(reversed);
    });

    // Confirma que NENHUMA das updates resolveu ainda
    expect(pendingResolvers.length).toBe(reversed.length);

    // Agora resolvemos e finalizamos para não vazar promise
    await act(async () => {
      resolveAllUpdates();
      const ok = await reorderPromise;
      expect(ok).toBe(true);
    });

    // Estado final continua com a ordem nova
    const finalIds = (result.current[listKey] as Array<{ id: string }>).map((i) => i.id);
    expect(finalIds).toEqual(reversed);
    expect(toastError).not.toHaveBeenCalled();
  });

  it("UI permanece otimista mesmo se um update falhar (refetch é disparado depois)", async () => {
    const { result } = renderHook(() => hook() as any);
    await waitFor(() => expect(result.current.loading).toBe(false));

    const initialIds = (result.current[listKey] as Array<{ id: string }>).map((i) => i.id);
    const reversed = [...initialIds].reverse();

    let reorderPromise!: Promise<boolean>;
    act(() => {
      reorderPromise = result.current.reorder(reversed);
    });

    // ordem otimista aplicada antes de qualquer resposta
    await waitFor(() => {
      const currentIds = (result.current[listKey] as Array<{ id: string }>).map((i) => i.id);
      expect(currentIds).toEqual(reversed);
    });

    // Resolve com erro no segundo update
    await act(async () => {
      pendingResolvers[0]({ error: null });
      pendingResolvers[1]({ error: { message: "boom" } });
      pendingResolvers[2]({ error: null });
      pendingResolvers = [];
      const ok = await reorderPromise;
      expect(ok).toBe(false);
    });

    expect(toastError).toHaveBeenCalled();
    const msg = toastError.mock.calls[0][0] as string;
    expect(msg).toContain("Erro ao reordenar");
  });
});
