"use client";

import { useCurrency } from "../_providers/CurrencyProvider";
import type { Moeda } from "../_providers/CurrencyProvider";

export function HeaderCurrencySelect() {
  const { moeda, setMoeda } = useCurrency();
  return (
    <select
      value={moeda}
      onChange={(e) => setMoeda(e.target.value as Moeda)}
      aria-label="Selecionar moeda"
      style={{ marginLeft: "auto" }}
    >
      <option value="USD">USD ($)</option>
      <option value="EUR">EUR (€)</option>
      <option value="BRL">BRL (R$)</option>
      <option value="GBP">GBP (£)</option>
      <option value="CHF">CHF (Fr.)</option>
    </select>
  );
}


