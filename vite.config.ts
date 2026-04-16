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
    // Aumenta limite do warning (chunks vendor são naturalmente >500KB)
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // manualChunks: separa vendors em chunks dedicados para melhor cache cross-deploy.
        // Quando o código da app muda mas as libs não, o navegador reusa os chunks vendor.
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;

          // React core: muda raramente, alta prioridade de cache
          if (id.includes("/react/") || id.includes("/react-dom/") || id.includes("/scheduler/")) {
            return "vendor-react";
          }
          // React Router
          if (id.includes("react-router")) {
            return "vendor-router";
          }
          // Supabase: SDK + auth
          if (id.includes("@supabase")) {
            return "vendor-supabase";
          }
          // Animações: framer-motion é ~80KB
          if (id.includes("framer-motion")) {
            return "vendor-motion";
          }
          // Radix UI primitives (shadcn): muitos pequenos pacotes
          if (id.includes("@radix-ui")) {
            return "vendor-radix";
          }
          // React Query
          if (id.includes("@tanstack/react-query")) {
            return "vendor-query";
          }
          // Forms / validação
          if (id.includes("react-hook-form") || id.includes("@hookform") || id.includes("zod")) {
            return "vendor-forms";
          }
          // Datas
          if (id.includes("date-fns")) {
            return "vendor-date";
          }
          // Ícones
          if (id.includes("lucide-react")) {
            return "vendor-icons";
          }
          // Demais libs node_modules → vendor genérico
          return "vendor";
        },
      },
    },
  },
}));
