/**
 * Utilitários para serializar/desserializar metadados extras de banners
 * (destaque e link de destino) dentro do campo `titulo` da tabela banners,
 * já que não podemos alterar o schema do banco.
 *
 * Formato do título armazenado:
 *   "★ Título visível|||https://link-destino.com"
 *
 * - Prefixo "★ " marca o banner como destaque principal (apenas 1 por vez)
 * - Separador "|||" delimita o link opcional
 */

import { z } from "zod";

export const DESTAQUE_PREFIX = "★ ";
export const LINK_SEPARATOR = "|||";

export interface BannerMeta {
  titulo: string;
  destaque: boolean;
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
  const destaque = raw.startsWith(DESTAQUE_PREFIX);
  const semPrefixo = destaque ? raw.slice(DESTAQUE_PREFIX.length) : raw;
  const sepIdx = semPrefixo.indexOf(LINK_SEPARATOR);
  if (sepIdx === -1) {
    return { titulo: semPrefixo, destaque, link: "" };
  }
  return {
    titulo: semPrefixo.slice(0, sepIdx),
    destaque,
    link: semPrefixo.slice(sepIdx + LINK_SEPARATOR.length),
  };
}

export function buildBannerTitulo(meta: BannerMeta): string {
  const titulo = meta.titulo.trim();
  const link = meta.link.trim();
  const base = link ? `${titulo}${LINK_SEPARATOR}${link}` : titulo;
  return meta.destaque ? `${DESTAQUE_PREFIX}${base}` : base;
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
