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

export function CityProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [showCityModal, setShowCityModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSelectedCity(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        setShowCityModal(true);
      }
    } else {
      // Show modal after a brief delay for better UX
      const timer = setTimeout(() => setShowCityModal(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const setCity = (city: City) => {
    setSelectedCity(city);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(city));
    setShowCityModal(false);
  };

  const clearCity = () => {
    setSelectedCity(null);
    localStorage.removeItem(STORAGE_KEY);
    setShowCityModal(true);
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
