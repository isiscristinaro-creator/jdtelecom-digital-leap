import { test, expect } from "../playwright-fixture";
import { suppressCityModal } from "./helpers";

test.describe("Home pública", () => {
  test.beforeEach(async ({ page }) => {
    await suppressCityModal(page);
  });

  test("carrega sem erros de console críticos", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const t = msg.text();
        // Ignorar ruído conhecido (favicon, requisições de rede em ambiente sem backend)
        if (/favicon|ERR_INTERNET_DISCONNECTED|Failed to load resource/i.test(t)) return;
        errors.push(t);
      }
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveTitle(/JD Telecom/i);
    // Aguarda a SPA hidratar
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
    expect(errors, errors.join("\n")).toHaveLength(0);
  });

  test("exibe a navbar e o link âncora para Planos", async ({ page }) => {
    await page.goto("/");
    // O Navbar tem um link/CTA para "#planos"
    const planosLink = page.locator('a[href="#planos"], a[href="/#planos"]').first();
    await expect(planosLink).toBeVisible();
  });

  test("possui rodapé com crédito SANNINS", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(/SANNINS/i);
  });

  test("rota inexistente mostra página 404", async ({ page }) => {
    await page.goto("/rota-que-nao-existe-123");
    await expect(page.getByText(/404/)).toBeVisible();
    await expect(page.getByText(/não encontrada/i)).toBeVisible();
  });
});
