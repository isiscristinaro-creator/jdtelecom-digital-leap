// Edge function pública: recebe leads do formulário /cadastro
// Validação Zod server-side + insert via service_role (RLS totalmente fechado).
// Anti-abuso: rate limit em memória por IP (best-effort) + limites de tamanho.

import { createClient } from "npm:@supabase/supabase-js@2.45.0";
import { z } from "npm:zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// --- Validação ----------------------------------------------------------------

const onlyDigits = (s: string) => s.replace(/\D/g, "");

function validarCNPJ(nums: string): boolean {
  if (nums.length !== 14 || /^(\d)\1+$/.test(nums)) return false;
  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let s = 0;
  for (let i = 0; i < 12; i++) s += parseInt(nums[i]) * w1[i];
  let r = s % 11;
  const d1 = r < 2 ? 0 : 11 - r;
  if (parseInt(nums[12]) !== d1) return false;
  s = 0;
  for (let i = 0; i < 13; i++) s += parseInt(nums[i]) * w2[i];
  r = s % 11;
  const d2 = r < 2 ? 0 : 11 - r;
  return parseInt(nums[13]) === d2;
}

function validarCPF(raw: string): boolean {
  const nums = onlyDigits(raw);
  if (nums.length === 14) return validarCNPJ(nums);
  if (nums.length !== 11 || /^(\d)\1+$/.test(nums)) return false;
  let s = 0;
  for (let i = 0; i < 9; i++) s += parseInt(nums[i]) * (10 - i);
  let r = (s * 10) % 11;
  if (r === 10) r = 0;
  if (r !== parseInt(nums[9])) return false;
  s = 0;
  for (let i = 0; i < 10; i++) s += parseInt(nums[i]) * (11 - i);
  r = (s * 10) % 11;
  if (r === 10) r = 0;
  return r === parseInt(nums[10]);
}

const schema = z.object({
  nome: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(255).transform((v) => v.toLowerCase()),
  cpf_cnpj: z.string().trim().min(11).max(18).refine(validarCPF, "CPF/CNPJ inválido"),
  nascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida").optional().nullable(),
  celular: z.string().trim().min(10).max(20),
  cep: z.string().trim().min(8).max(9),
  endereco: z.string().trim().min(1).max(255),
  numero: z.string().trim().min(1).max(20),
  bairro: z.string().trim().min(1).max(120),
  cidade: z.string().trim().min(1).max(120),
  estado: z.string().trim().length(2).toUpperCase(),
  ponto_referencia: z.string().trim().max(255).optional().nullable(),
  vencimento: z.string().trim().min(1).max(2),
  plano: z.string().trim().min(1).max(120),
});

// --- Rate limit (best-effort, memória da instância) ---------------------------
// Edge functions reciclam, então isso só barra picos óbvios — proteção real
// vem da hospedagem (Cloudflare/Supabase) e do limite de tamanho.

const RL_WINDOW_MS = 60_000;
const RL_MAX = 5; // 5 leads / min / IP
const buckets = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now > b.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + RL_WINDOW_MS });
    return false;
  }
  b.count += 1;
  if (b.count > RL_MAX) return true;
  return false;
}

// --- Handler ------------------------------------------------------------------

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  // Tamanho máximo do body: 8KB (defesa contra payload abuse)
  const ct = req.headers.get("content-length");
  if (ct && parseInt(ct) > 8192) {
    return json({ error: "Payload too large" }, 413);
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return json({ error: "Muitas tentativas. Aguarde 1 minuto." }, 429);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "JSON inválido" }, 400);
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return json(
      { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
      400,
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return json({ error: "Servidor mal configurado" }, 500);
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const lead = {
    ...parsed.data,
    status: "novo",
    origem: "site_cadastro",
  };

  const { data, error } = await admin
    .from("leads")
    .insert(lead)
    .select("id")
    .single();

  if (error) {
    console.error("Insert lead error:", error);
    return json({ error: "Não foi possível registrar agora" }, 500);
  }

  return json({ ok: true, id: data?.id });
});
