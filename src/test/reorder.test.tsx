/**
 * Testes para os hooks de reorder (usePlans, useBanners, useTestemunhos, useProdutos).
 *
 * Cobertura:
 *  - orderedIds vazio: NÃO faz chamadas ao supabase, retorna true
 *  - sucesso: chama update por ID com { ordem: idx } e retorna true
 *  - erro parcial: detecta erro em qualquer update, exibe toast e refaz fetch
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";

// ---- Mocks ----
const toastError = vi.fn();
const toastSuccess = vi.fn();
vi.mock("sonner", () => ({
  toast: { error: (...a: any[]) => toastError(...a), success: (...a: any[]) => toastSuccess(...a) },
}));

// Construtor de query encadeável usado pelo cliente supabase
type EqResult = { error: any };
let updateCallLog: Array<{ table: string; values: any; id: string }> = [];
let selectResults: Record<string, any[]> = {};
let updateErrorByCallIndex: Record<number, any> = {};

function makeSupabaseMock() {
  return {
    from: (table: string) => ({
      select: () => ({
        order: () => ({
          order: () => Promise.resolve({ data: selectResults[table] ?? [], error: null }),
          // also support single-order chains used elsewhere
          then: undefined,
        }),
      }),
      update: (values: any) => ({
        eq: (_col: string, id: string) => {
          const idx = updateCallLog.length;
          updateCallLog.push({ table, values, id });
          const err = updateErrorByCallIndex[idx] ?? null;
          return Promise.resolve({ error: err } satisfies EqResult);
        },
      }),
      insert: () => Promise.resolve({ error: null }),
      delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }),
  };
}

vi.mock("@/integrations/supabase/client", () => ({
  supabase: makeSupabaseMock(),
}));

// ---- Imports após mocks ----
import { usePlans } from "@/hooks/supabase/usePlans";
import { useBanners } from "@/hooks/supabase/useBanners";
import { useTestemunhos } from "@/hooks/supabase/useTestemunhos";
import { useProdutos } from "@/hooks/supabase/useProdutos";

const HOOKS = [
  { name: "usePlans", hook: usePlans, table: "plans", listKey: "plans" as const },
  { name: "useBanners", hook: useBanners, table: "banners", listKey: "banners" as const },
  { name: "useTestemunhos", hook: useTestemunhos, table: "testemunhos", listKey: "testemunhos" as const },
  { name: "useProdutos", hook: useProdutos, table: "produtos", listKey: "produtos" as const },
];

beforeEach(() => {
  toastError.mockClear();
  toastSuccess.mockClear();
  updateCallLog = [];
  updateErrorByCallIndex = {};
  selectResults = {
    plans: [{ id: "p1" }, { id: "p2" }, { id: "p3" }],
    banners: [{ id: "b1" }, { id: "b2" }, { id: "b3" }],
    testemunhos: [{ id: "t1" }, { id: "t2" }, { id: "t3" }],
    produtos: [{ id: "x1" }, { id: "x2" }, { id: "x3" }],
  };
});

describe.each(HOOKS)("$name reorder", ({ hook, table, listKey }) => {
  it("orderedIds vazio: não faz chamadas e retorna true", async () => {
    const { result } = renderHook(() => hook() as any);
    await waitFor(() => expect(result.current.loading).toBe(false));

    let returned: boolean | undefined;
    await act(async () => {
      returned = await result.current.reorder([]);
    });

    expect(returned).toBe(true);
    expect(updateCallLog.filter((c) => c.table === table)).toHaveLength(0);
    expect(toastError).not.toHaveBeenCalled();
  });

  it("sucesso: envia update com {ordem: idx} para cada id na ordem informada", async () => {
    const { result } = renderHook(() => hook() as any);
    await waitFor(() => expect(result.current.loading).toBe(false));

    const ids = (result.current[listKey] as Array<{ id: string }>).map((i) => i.id);
    // inverter a ordem
    const reversed = [...ids].reverse();

    let returned: boolean | undefined;
    await act(async () => {
      returned = await result.current.reorder(reversed);
    });

    expect(returned).toBe(true);
    const calls = updateCallLog.filter((c) => c.table === table);
    expect(calls).toHaveLength(reversed.length);
    reversed.forEach((id, idx) => {
      expect(calls[idx].id).toBe(id);
      expect(calls[idx].values).toEqual({ ordem: idx });
    });
    expect(toastError).not.toHaveBeenCalled();
  });

  it("erro parcial: detecta o primeiro erro, exibe toast e retorna false", async () => {
    const { result } = renderHook(() => hook() as any);
    await waitFor(() => expect(result.current.loading).toBe(false));

    const ids = (result.current[listKey] as Array<{ id: string }>).map((i) => i.id);
    // Simula falha no segundo update
    updateErrorByCallIndex[1] = { message: "boom-update-2" };

    let returned: boolean | undefined;
    await act(async () => {
      returned = await result.current.reorder(ids);
    });

    expect(returned).toBe(false);
    expect(toastError).toHaveBeenCalled();
    const msg = toastError.mock.calls[0][0] as string;
    expect(msg).toContain("Erro ao reordenar");
    expect(msg).toContain("boom-update-2");
  });
});
