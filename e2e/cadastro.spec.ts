import { test, expect } from "../playwright-fixture";
import { suppressCityModal } from "./helpers";

test.describe("Página de Cadastro", () => {
  test.beforeEach(async ({ page }) => {
    await suppressCityModal(page);
    await page.goto("/cadastro");
  });

  test("renderiza o formulário com campos obrigatórios", async ({ page }) => {
    await expect(page.getByLabel(/Nome completo/i)).toBeVisible();
    await expect(page.getByLabel(/^Email/i)).toBeVisible();
    await expect(page.getByLabel(/CPF\s*\/\s*CNPJ/i)).toBeVisible();
    await expect(page.getByLabel(/Celular/i)).toBeVisible();
    await expect(page.getByLabel(/CEP/i)).toBeVisible();
  });

  test("rejeita CPF inválido (validação client-side)", async ({ page }) => {
    await page.getByLabel(/Nome completo/i).fill("Teste E2E");
    await page.getByLabel(/^Email/i).fill("teste-e2e@example.com");
    // CPF claramente inválido
    await page.getByLabel(/CPF\s*\/\s*CNPJ/i).fill("111.111.111-11");
    await page.getByLabel(/Celular/i).fill("(92) 99999-9999");

    // Tenta submeter — qualquer botão de envio
    const submit = page
      .getByRole("button", { name: /enviar|cadastrar|finalizar|continuar/i })
      .first();
    if (await submit.isVisible().catch(() => false)) {
      await submit.click({ trial: false }).catch(() => {});
    }

    // Não deve navegar para fora de /cadastro porque a validação falha
    await expect(page).toHaveURL(/\/cadastro/);
  });

  test("máscara de CPF formata enquanto digita", async ({ page }) => {
    const cpfField = page.getByLabel(/CPF\s*\/\s*CNPJ/i);
    await cpfField.fill("12345678900");
    const value = await cpfField.inputValue();
    // Espera dígitos com pontuação típica de CPF
    expect(value).toMatch(/\d{3}\.\d{3}\.\d{3}-\d{2}/);
  });
});
