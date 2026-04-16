import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useEffect, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly scrollMargin = "0px";
  readonly thresholds = [0];

  constructor(_callback: IntersectionObserverCallback) {}

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

function setReducedMotion(enabled: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: enabled && query === "(prefers-reduced-motion: reduce)",
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
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
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

function HookProbe() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <>
      <div data-testid="target" ref={ref as (node: HTMLDivElement | null) => void} />
      <span data-testid="state">{isVisible ? "visible" : "hidden"}</span>
    </>
  );
}

function DeferredMountProbe() {
  const [ready, setReady] = useState(false);
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      {ready ? <div data-testid="target" ref={ref as (node: HTMLDivElement | null) => void} /> : null}
      <span data-testid="state">{isVisible ? "visible" : "hidden"}</span>
    </>
  );
}

describe("useScrollAnimation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    global.IntersectionObserver = MockIntersectionObserver;
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 800,
    });
    setReducedMotion(false);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("marca isVisible imediatamente quando o elemento já está na viewport", () => {
    mockBoundingRect({ top: 120, bottom: 420 });

    render(<HookProbe />);

    expect(screen.getByTestId("state")).toHaveTextContent("visible");
  });

  it("marca isVisible imediatamente quando prefers-reduced-motion está ativo", () => {
    setReducedMotion(true);
    mockBoundingRect({ top: 5000, bottom: 5400 });

    render(<HookProbe />);

    expect(screen.getByTestId("state")).toHaveTextContent("visible");
  });

  it("marca isVisible via fallback de 800ms quando o observer não dispara", () => {
    mockBoundingRect({ top: 5000, bottom: 5400 });

    render(<HookProbe />);

    expect(screen.getByTestId("state")).toHaveTextContent("hidden");

    act(() => {
      vi.advanceTimersByTime(799);
    });
    expect(screen.getByTestId("state")).toHaveTextContent("hidden");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByTestId("state")).toHaveTextContent("visible");
  });

  it("funciona quando o elemento surge apenas após carregamento assíncrono", () => {
    mockBoundingRect({ top: 160, bottom: 460 });

    render(<DeferredMountProbe />);

    expect(screen.getByTestId("state")).toHaveTextContent("visible");
  });
});
