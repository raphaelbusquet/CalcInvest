"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Moeda = "BRL" | "USD" | "EUR" | "GBP" | "CHF";

type CurrencyContextValue = {
  moeda: Moeda;
  setMoeda: (m: Moeda) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency deve ser usado dentro de CurrencyProvider");
  return ctx;
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [moeda, setMoeda] = useState<Moeda>("BRL");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("global_currency");
      if (saved) setMoeda(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("global_currency", JSON.stringify(moeda));
    } catch {}
  }, [moeda]);

  return (
    <CurrencyContext.Provider value={{ moeda, setMoeda }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function currencySymbol(m: Moeda): string {
  switch (m) {
    case "BRL":
      return "R$";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "CHF":
      return "Fr.";
    default:
      return "";
  }
}


