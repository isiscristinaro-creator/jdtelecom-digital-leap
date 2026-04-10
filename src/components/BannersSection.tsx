import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface Banner {
  id: string;
  titulo: string;
  imagem_url: string;
}

const BannersSection = () => {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("banners")
        .select("id, titulo, imagem_url")
        .eq("ativo", true)
        .order("created_at", { ascending: false });
      if (data?.length) setBanners(data);
    })();
  }, []);

  if (!banners.length) return null;

  return (
    <section className="py-12 sm:py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full mb-3">
            Promoções
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Ofertas Especiais
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner, i) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden border border-border bg-card shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={banner.imagem_url}
                  alt={banner.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white font-semibold text-sm md:text-base">
                  {banner.titulo}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BannersSection;
