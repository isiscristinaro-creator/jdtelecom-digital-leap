import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface City {
  name: string;
  state: string;
}

export const AVAILABLE_CITIES: City[] = [
  { name: "Manaus", state: "AM" },
  { name: "Nhamundá", state: "AM" },
  { name: "Terra Santa", state: "PA" },
  { name: "Faro", state: "PA" },
  { name: "Santarém", state: "PA" },
  { name: "Oriximiná", state: "PA" },
  { name: "Bagre", state: "PA" },
  { name: "Breves", state: "PA" },
  { name: "Melgaço", state: "PA" },
  { name: "Portel", state: "PA" },
  { name: "Redenção", state: "PA" },
];

interface CityContextType {
  selectedCity: City | null;
  setCity: (city: City) => void;
  clearCity: () => void;
  showCityModal: boolean;
  setShowCityModal: (show: boolean) => void;
}

const CityContext = createContext<CityContextType | null>(null);

const STORAGE_KEY = "jd_selected_city";
const DISMISSED_KEY = "jd_city_modal_dismissed";

export function CityProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [showCityModal, setShowCityModalState] = useState(false);

  const setShowCityModal = (show: boolean) => {
    setShowCityModalState(show);
    if (!show) {
      // Marca dispensa para não reabrir nesta sessão.
      try {
        sessionStorage.setItem(DISMISSED_KEY, "1");
      } catch {
        // ignore
      }
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSelectedCity(JSON.parse(saved));
        return;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    // Não abrir automaticamente se:
    // - usuário já dispensou nesta sessão
    // - URL tem hash (deep-link para uma seção específica)
    const dismissed = sessionStorage.getItem(DISMISSED_KEY) === "1";
    const hasHash = typeof window !== "undefined" && window.location.hash.length > 1;
    if (dismissed || hasHash) return;

    // Atraso para dar respiro visual ao hero antes de abrir.
    const timer = setTimeout(() => setShowCityModalState(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const setCity = (city: City) => {
    setSelectedCity(city);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(city));
    setShowCityModalState(false);
  };

  const clearCity = () => {
    setSelectedCity(null);
    localStorage.removeItem(STORAGE_KEY);
    try {
      sessionStorage.removeItem(DISMISSED_KEY);
    } catch {
      // ignore
    }
    setShowCityModalState(true);
  };

  return (
    <CityContext.Provider value={{ selectedCity, setCity, clearCity, showCityModal, setShowCityModal }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error("useCity must be used within CityProvider");
  return ctx;
}
