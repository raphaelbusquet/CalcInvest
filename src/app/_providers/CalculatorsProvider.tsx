"use client";

import { createContext, useContext, useMemo, useState } from "react";

type InvestmentCalculatorState = {
  aporteInicial: string;
  aporteMensal: string;
  taxaAnual: string;
  anos: string;
  descontarInflacao: boolean;
  inflacaoAnual: string;
};

type DividendsCalculatorState = {
  rendaMensalDesejada: string;
  frequencia: "mensal" | "trimestral" | "semestral" | "anual";
  dividendYield: string;
  precoAcao: string;
  incluirImposto: boolean;
  aliquotaImposto: string;
};

type CalculatorsContextValue = {
  investment: InvestmentCalculatorState;
  setInvestment: (s: InvestmentCalculatorState) => void;
  dividends: DividendsCalculatorState;
  setDividends: (s: DividendsCalculatorState) => void;
  resetAll: () => void;
  quiz: QuizState;
  setQuiz: (s: QuizState) => void;
  resetQuiz: () => void;
};

const defaultInvestment: InvestmentCalculatorState = {
  aporteInicial: "10000",
  aporteMensal: "500",
  taxaAnual: "10",
  anos: "5",
  descontarInflacao: false,
  inflacaoAnual: "4",
};

const defaultDividends: DividendsCalculatorState = {
  rendaMensalDesejada: "3000",
  frequencia: "mensal",
  dividendYield: "2.5",
  precoAcao: "100",
  incluirImposto: false,
  aliquotaImposto: "30",
};

type OptionKey = "a" | "b" | "c";

type QuizState = {
  current: number;
  answers: (OptionKey | null)[];
  submitted: boolean;
};

const defaultQuiz: QuizState = {
  current: 0,
  answers: Array(10).fill(null),
  submitted: false,
};

const CalculatorsContext = createContext<CalculatorsContextValue | undefined>(undefined);

export function useCalculators() {
  const ctx = useContext(CalculatorsContext);
  if (!ctx) throw new Error("useCalculators deve ser usado dentro de CalculatorsProvider");
  return ctx;
}

export function CalculatorsProvider({ children }: { children: React.ReactNode }) {
  // Persistência apenas em memória: manter entre navegações mas resetar no reload
  const [investment, setInvestment] = useState<InvestmentCalculatorState>(defaultInvestment);
  const [dividends, setDividends] = useState<DividendsCalculatorState>(defaultDividends);
  const [quiz, setQuiz] = useState<QuizState>(defaultQuiz);

  const value = useMemo<CalculatorsContextValue>(() => ({
    investment,
    setInvestment,
    dividends,
    setDividends,
    quiz,
    setQuiz,
    resetAll: () => {
      setInvestment(defaultInvestment);
      setDividends(defaultDividends);
      setQuiz(defaultQuiz);
    },
    resetQuiz: () => setQuiz(defaultQuiz),
  }), [investment, dividends, quiz]);

  return (
    <CalculatorsContext.Provider value={value}>
      {children}
    </CalculatorsContext.Provider>
  );
}


