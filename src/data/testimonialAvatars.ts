import carlosMendes from "@/assets/testimonials/carlos-mendes.jpg";
import anaBeatriz from "@/assets/testimonials/ana-beatriz.jpg";
import robertoSilva from "@/assets/testimonials/roberto-silva.jpg";
import marcosOliveira from "@/assets/testimonials/marcos-oliveira.jpg";
import julianaCosta from "@/assets/testimonials/juliana-costa.jpg";
import pedroHenrique from "@/assets/testimonials/pedro-henrique.jpg";
import fernandaLima from "@/assets/testimonials/fernanda-lima.jpg";
import lucasAraujo from "@/assets/testimonials/lucas-araujo.jpg";
import patriciaSantos from "@/assets/testimonials/patricia-santos.jpg";
import rafaelSouza from "@/assets/testimonials/rafael-souza.jpg";
import mariaSilva from "@/assets/testimonials/maria-silva.jpg";
import joaoSantos from "@/assets/testimonials/joao-santos.jpg";
import amandaOliveira from "@/assets/testimonials/amanda-oliveira.jpg";
import josePereira from "@/assets/testimonials/jose-pereira.jpg";
import camilaRodrigues from "@/assets/testimonials/camila-rodrigues.jpg";

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
  "Rafael Souza": rafaelSouza,
  "Maria Silva": mariaSilva,
  "João Santos": joaoSantos,
  "Amanda Oliveira": amandaOliveira,
  "José Pereira": josePereira,
  "Camila Rodrigues": camilaRodrigues,
};

// First-name to avatar for partial matching of DB names
const FIRST_NAME_MAP: Record<string, string> = {
  carlos: carlosMendes,
  ana: anaBeatriz,
  roberto: robertoSilva,
  marcos: marcosOliveira,
  juliana: julianaCosta,
  pedro: pedroHenrique,
  fernanda: fernandaLima,
  lucas: lucasAraujo,
  patricia: patriciaSantos,
  rafael: rafaelSouza,
  maria: mariaSilva,
  joao: joaoSantos,
  amanda: amandaOliveira,
  jose: josePereira,
  camila: camilaRodrigues,
};

function normalize(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

/**
 * Returns the AI-generated avatar for a testimonial name,
 * or a DiceBear fallback for unknown names.
 */
export function getTestimonialAvatar(nome: string): string {
  if (!nome) return `https://api.dicebear.com/9.x/initials/svg?seed=JD&backgroundColor=f97316`;

  // Exact match
  if (AVATAR_MAP[nome]) return AVATAR_MAP[nome];

  // Normalized full-name match
  const normalized = normalize(nome);
  for (const [key, val] of Object.entries(AVATAR_MAP)) {
    if (normalize(key) === normalized) return val;
  }

  // First-name match (handles DB names like "Rafael Lima", "Maria Costa" etc.)
  const firstName = normalized.split(" ")[0];
  if (FIRST_NAME_MAP[firstName]) return FIRST_NAME_MAP[firstName];

  // Fallback: DiceBear initials
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(nome)}&backgroundColor=f97316`;
}
