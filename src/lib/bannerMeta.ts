/**
 * Utilitários para serializar/desserializar metadados extras de banners
 * (destaque, hero e link de destino) dentro do campo `titulo` da tabela banners,
 * já que não podemos alterar o schema do banco.
 *
 * Formato do título armazenado:
 *   "[HERO] ★ Título visível|||https://link-destino.com"
 *
 * - Prefixo "[HERO] " marca o banner como pertencente ao carrossel hero da home
 * - Prefixo "★ " marca como destaque principal (apenas 1 por vez na seção de ofertas)
 * - Separador "|||" delimita o link opcional
 */

import { z } from "zod";

export const DESTAQUE_PREFIX = "★ ";
export const HERO_PREFIX = "[HERO] ";
export const LINK_SEPARATOR = "|||";

export interface BannerMeta {
  titulo: string;
  destaque: boolean;
  hero: boolean;
  link: string;
}

// Schema para validar o link (URL absoluta http/https ou âncora interna ou caminho relativo)
const linkSchema = z
  .string()
  .trim()
  .max(500, "Link muito longo (máx. 500 caracteres)")
  .refine(
    (val) =>
      val === "" ||
      /^https?:\/\//i.test(val) ||
      val.startsWith("#") ||
      val.startsWith("/"),
    { message: "Use URL https://, caminho /interno ou âncora #seção" }
  );

export function parseBannerTitulo(raw: string): BannerMeta {
  let working = raw;
  const hero = working.startsWith(HERO_PREFIX);
  if (hero) working = working.slice(HERO_PREFIX.length);
  const destaque = working.startsWith(DESTAQUE_PREFIX);
  const semPrefixo = destaque ? working.slice(DESTAQUE_PREFIX.length) : working;
  const sepIdx = semPrefixo.indexOf(LINK_SEPARATOR);
  if (sepIdx === -1) {
    return { titulo: semPrefixo, destaque, hero, link: "" };
  }
  return {
    titulo: semPrefixo.slice(0, sepIdx),
    destaque,
    hero,
    link: semPrefixo.slice(sepIdx + LINK_SEPARATOR.length),
  };
}

export function buildBannerTitulo(meta: BannerMeta): string {
  const titulo = meta.titulo.trim();
  const link = meta.link.trim();
  const base = link ? `${titulo}${LINK_SEPARATOR}${link}` : titulo;
  const withDestaque = meta.destaque ? `${DESTAQUE_PREFIX}${base}` : base;
  return meta.hero ? `${HERO_PREFIX}${withDestaque}` : withDestaque;
}

export function isHeroTitulo(raw: string): boolean {
  return raw.startsWith(HERO_PREFIX);
}

export function validateBannerLink(link: string): { ok: boolean; error: string } {
  const result = linkSchema.safeParse(link);
  if (result.success) return { ok: true, error: "" };
  return { ok: false, error: result.error.issues[0]?.message ?? "Link inválido" };
}

/**
 * Resolve um link para uso seguro em href. Se vazio, retorna fallback.
 * Bloqueia esquemas perigosos (javascript:, data:).
 */
export function safeBannerHref(link: string, fallback = "#planos"): string {
  const trimmed = link.trim();
  if (!trimmed) return fallback;
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return fallback;
  return trimmed;
}
