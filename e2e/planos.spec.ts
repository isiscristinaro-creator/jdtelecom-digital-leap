import { test, expect } from "../playwright-fixture";
import { suppressCityModal } from "./helpers";

test.describe("Seção Planos", () => {
  test.beforeEach(async ({ page }) => {
    await suppressCityModal(page);
  });

  test("renderiza os 4 planos principais com preços", async ({ page }) => {
    await page.goto("/#planos");
    const planos = page.locator("#planos");
    await expect(planos).toBeVisible();

    // Velocidades dos 4 planos
    for (const speed of ["400", "600", "800", "1000"]) {
      await expect(planos.getByText(new RegExp(`\\b${speed}\\b`)).first()).toBeVisible();
    }

    // Preços R$ correspondentes
    for (const price of ["139", "179", "229", "349"]) {
      await expect(planos.getByText(new RegExp(price)).first()).toBeVisible();
    }
  });

  test("plano popular exibe a tag MELHOR OFERTA", async ({ page }) => {
    await page.goto("/#planos");
    await expect(
      page.locator("#planos").getByText(/MELHOR OFERTA/i).first(),
    ).toBeVisible();
  });

  test("link âncora #planos rola até a seção", async ({ page }) => {
    await page.goto("/");
    await page.locator('a[href="#planos"], a[href="/#planos"]').first().click();
    await expect(page.locator("#planos")).toBeInViewport({ timeout: 5_000 });
  });
});
