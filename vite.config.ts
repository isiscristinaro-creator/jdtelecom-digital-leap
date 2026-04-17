import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Nomes de arquivo determinísticos com hash de conteúdo:
        // - chunks vendor mantêm o mesmo nome enquanto o conteúdo não muda
        //   → cache de longo prazo (Cache-Control: immutable) sobrevive entre deploys
        // - apenas chunks alterados recebem hash novo, forçando re-download só do que mudou
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
        // manualChunks: agrupa SOMENTE libs leves e amplamente compartilhadas em chunks vendor.
        // Libs pesadas (xlsx, jspdf, recharts, html2canvas) ficam de fora e o Vite mantém
        // o code-splitting natural — elas só são baixadas quando a rota admin que as usa carrega.
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;

          // React core (raramente muda → cache estável)
          if (id.includes("/react/") || id.includes("/react-dom/") || id.includes("/scheduler/")) {
            return "vendor-react";
          }
          if (id.includes("react-router")) return "vendor-router";

          // Supabase SDK (usado em quase tudo)
          if (id.includes("@supabase")) return "vendor-supabase";

          // Animações: framer-motion (~80KB) usado em muitas seções públicas
          if (id.includes("framer-motion")) return "vendor-motion";

          // Radix UI primitives (shadcn) — usados em quase todas as páginas
          if (id.includes("@radix-ui")) return "vendor-radix";

          // React Query
          if (id.includes("@tanstack/react-query")) return "vendor-query";

          // Forms / validação
          if (id.includes("react-hook-form") || id.includes("@hookform") || id.includes("/zod/")) {
            return "vendor-forms";
          }

          // Ícones
          if (id.includes("lucide-react")) return "vendor-icons";

          // IMPORTANTE: NÃO retornamos "vendor" para tudo o resto — isso
          // forçava libs pesadas raramente usadas (xlsx, jspdf, recharts, html2canvas)
          // a entrarem num único chunk obrigatório de 2.4MB. Deixando undefined,
          // o Rollup mantém o code-splitting natural (cada lib pesada vira seu próprio
          // chunk lazy, carregado só pela rota que a importa dinamicamente).
          return undefined;
        },
      },
    },
  },
}));
