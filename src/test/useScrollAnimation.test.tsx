import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type IOEntryCb = (entries: IntersectionObserverEntry[]) => void;

let observerCallbacks: IOEntryCb[] = [];

class MockIntersectionObserver {
  cb: IOEntryCb;
  constructor(cb: IOEntryCb) {
    this.cb = cb;
    observerCallbacks.push(cb);
  }
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = "";
  thresholds = [];
}

function setMatchMedia(reducedMotion: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches:
        reducedMotion && query === "(prefers-reduced-motion: reduce)"
          ? true
          : false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

function mockBoundingRect(rect: Partial<DOMRect>) {
  // Override prototype so any element ref returns the mocked rect.
  Element.prototype.getBoundingClientRect = vi.fn(
    () =>
      ({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
        ...rect,
      }) as DOMRect,
  );
}

describe("useScrollAnimation", () => {
  beforeEach(() => {
    observerCallbacks = [];
    vi.useFakeTimers();
    // @ts-expect-error - mock global IO
    global.IntersectionObserver = MockIntersectionObserver;
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 800,
    });
    setMatchMedia(false);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("marca isVisible imediatamente quando o elemento já está na viewport", () => {
    mockBoundingRect({ top: 100, bottom: 400 });

    const { result } = renderHook(() => useScrollAnimation());

    // Anexa o ref ao elemento DOM real para o efeito rodar.
    const div = document.createElement("div");
    Object.defineProperty(result.current.ref, "current", {
      writable: true,
      value: div,
    });

    // Re-render para acionar o useEffect com o ref preenchido.
    const { result: r2 } = renderHook(() => {
      const hook = useScrollAnimation();
      // Simula ref preenchido antes do effect via attach manual no DOM
      return hook;
    });

    // Caminho real: o hook usa ref.current dentro do effect. Como o ref
    // começa null no primeiro render, validamos diretamente o comportamento
    // criando um cenário com elemento montado:
    const TestRef = () => {
      const h = useScrollAnimation();
      // attach do div ao current
      (h.ref as { current: HTMLDivElement | null }).current = div;
      return h;
    };
    const { result: r3 } = renderHook(() => TestRef());
    expect(r3.current.isVisible).toBe(true);
    void result;
    void r2;
  });

  it("marca isVisible imediatamente quando prefers-reduced-motion está ativo", () => {
    setMatchMedia(true);
    // Mesmo se o elemento estivesse fora da viewport, reduced-motion vence.
    mockBoundingRect({ top: 5000, bottom: 5400 });

    const div = document.createElement("div");
    const TestRef = () => {
      const h = useScrollAnimation();
      (h.ref as { current: HTMLDivElement | null }).current = div;
      return h;
    };
    const { result } = renderHook(() => TestRef());
    expect(result.current.isVisible).toBe(true);
  });

  it("marca isVisible via fallback de 800ms quando o observer não dispara", () => {
    // Elemento fora da viewport e sem reduced-motion -> registra observer.
    mockBoundingRect({ top: 5000, bottom: 5400 });

    const div = document.createElement("div");
    const TestRef = () => {
      const h = useScrollAnimation();
      (h.ref as { current: HTMLDivElement | null }).current = div;
      return h;
    };
    const { result } = renderHook(() => TestRef());

    // Antes do timeout: ainda não visível.
    expect(result.current.isVisible).toBe(false);

    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(result.current.isVisible).toBe(true);
  });
});
