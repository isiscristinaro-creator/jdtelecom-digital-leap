import type { Page } from "@playwright/test";

/**
 * Suprime o modal de seleção de cidade (CityProvider) injetando os
 * flags em localStorage/sessionStorage ANTES da app montar.
 * Sem isso, o modal abre após 2,5 s e bloqueia interações.
 */
export async function suppressCityModal(page: Page) {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem(
        "jd_selected_city",
        JSON.stringify({ name: "Manaus", state: "AM" }),
      );
      window.sessionStorage.setItem("jd_city_modal_dismissed", "1");
      // CookieConsent também
      window.localStorage.setItem("jd_cookie_consent", "accepted");
    } catch {
      // ignore (storage indisponível)
    }
  });
}
