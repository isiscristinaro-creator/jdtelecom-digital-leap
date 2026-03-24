import { useState, useMemo } from "react";
import { MapPin, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCity, AVAILABLE_CITIES, City } from "@/contexts/CityContext";

const CitySelector = () => {
  const { showCityModal, setShowCityModal, setCity } = useCity();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return AVAILABLE_CITIES;
    const q = search.toLowerCase();
    return AVAILABLE_CITIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
    );
  }, [search]);

  const handleSelect = (city: City) => {
    setCity(city);
    setSearch("");
  };

  const handleClose = () => {
    setShowCityModal(false);
    setSearch("");
  };

  return (
    <AnimatePresence>
      {showCityModal && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md bg-[hsl(var(--dark-section))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-6 md:p-8 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-muted))] hover:text-[hsl(var(--dark-section-fg))] hover:border-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-7 h-7 text-primary" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-[hsl(var(--dark-section-fg))] text-center mb-2">
              Personalize sua experiência
            </h2>
            <p className="text-sm text-[hsl(var(--dark-section-muted))] text-center mb-6">
              Informe sua cidade para mostrarmos as melhores ofertas disponíveis na sua região
            </p>

            {/* Search input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--dark-section-muted))]" />
              <input
                type="text"
                placeholder="Digite sua cidade"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-12 pl-10 pr-4 bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-xl text-sm text-[hsl(var(--dark-section-fg))] placeholder:text-[hsl(var(--dark-section-muted))] focus:outline-none focus:border-primary transition-colors"
                autoFocus
              />
            </div>

            {/* City list */}
            <div className="max-h-[240px] overflow-y-auto space-y-1 scrollbar-thin">
              {filtered.length === 0 ? (
                <p className="text-sm text-[hsl(var(--dark-section-muted))] text-center py-4">
                  Nenhuma cidade encontrada
                </p>
              ) : (
                filtered.map((city) => (
                  <button
                    key={`${city.name}-${city.state}`}
                    onClick={() => handleSelect(city)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-primary/10 transition-colors group"
                  >
                    <MapPin className="w-4 h-4 text-[hsl(var(--dark-section-muted))] group-hover:text-primary transition-colors shrink-0" />
                    <span className="text-sm text-[hsl(var(--dark-section-fg))] group-hover:text-primary transition-colors">
                      {city.name}
                    </span>
                    <span className="text-xs text-[hsl(var(--dark-section-muted))] ml-auto">
                      {city.state}
                    </span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CitySelector;
