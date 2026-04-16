import carlosMendes from "@/assets/testimonials/carlos-mendes.jpg";
import anaBeatriz from "@/assets/testimonials/ana-beatriz.jpg";
import robertoSilva from "@/assets/testimonials/roberto-silva.jpg";
import marcosOliveira from "@/assets/testimonials/marcos-oliveira.jpg";
import julianaCosta from "@/assets/testimonials/juliana-costa.jpg";
import pedroHenrique from "@/assets/testimonials/pedro-henrique.jpg";
import fernandaLima from "@/assets/testimonials/fernanda-lima.jpg";
import lucasAraujo from "@/assets/testimonials/lucas-araujo.jpg";
import patriciaSantos from "@/assets/testimonials/patricia-santos.jpg";

const AVATAR_MAP: Record<string, string> = {
  "Carlos Mendes": carlosMendes,
  "Ana Beatriz": anaBeatriz,
  "Roberto Silva": robertoSilva,
  "Marcos Oliveira": marcosOliveira,
  "Juliana Costa": julianaCosta,
  "Pedro Henrique": pedroHenrique,
  "Fernanda Lima": fernandaLima,
  "Lucas Araújo": lucasAraujo,
  "Patrícia Santos": patriciaSantos,
};

/**
 * Returns the AI-generated avatar for a testimonial name,
 * or a DiceBear fallback for unknown names.
 */
export function getTestimonialAvatar(nome: string): string {
  if (AVATAR_MAP[nome]) return AVATAR_MAP[nome];
  // Normalize: try without accents
  const normalized = nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const [key, val] of Object.entries(AVATAR_MAP)) {
    const normKey = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (normKey === normalized) return val;
  }
  // Fallback: DiceBear initials
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(nome)}&backgroundColor=f97316`;
}
