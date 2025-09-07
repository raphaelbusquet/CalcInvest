"use client";

import { useMemo, useState } from "react";
import { Moeda } from "../_providers/CurrencyProvider";
import { useCurrency } from "../_providers/CurrencyProvider";
import { useCalculators } from "../_providers/CalculatorsProvider";

function formatCurrency(n: number, currency: Moeda) {
  const locale = currency === "EUR" ? "pt-PT" : "pt-BR";
  return n.toLocaleString(locale, { style: "currency", currency });
}

export default function CalculadoraPage() {
  const { investment, setInvestment } = useCalculators();
  const { aporteInicial, aporteMensal, taxaAnual, anos, descontarInflacao, inflacaoAnual } = investment;
  const { moeda, setMoeda } = useCurrency();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resultado = useMemo(() => {
    const aporteInicialNum = aporteInicial === "" ? NaN : Number(aporteInicial);
    const aporteMensalNum = aporteMensal === "" ? NaN : Number(aporteMensal);
    const taxaAnualNum = taxaAnual === "" ? NaN : Number(taxaAnual);
    const anosNum = anos === "" ? NaN : Number(anos);
    const inflacaoAnualNum = inflacaoAnual === "" ? NaN : Number(inflacaoAnual);

    const newErrors: Record<string, string> = {};
    if (Number.isNaN(aporteInicialNum)) newErrors.aporteInicial = "Preencha este campo.";
    else if (aporteInicialNum < 0) newErrors.aporteInicial = "Aporte inicial não pode ser negativo.";

    if (Number.isNaN(aporteMensalNum)) newErrors.aporteMensal = "Preencha este campo.";
    else if (aporteMensalNum < 0) newErrors.aporteMensal = "Aporte mensal não pode ser negativo.";

    if (Number.isNaN(anosNum)) newErrors.anos = "Preencha este campo.";
    else if (anosNum < 1) newErrors.anos = "Prazo mínimo é 1 ano.";

    if (Number.isNaN(taxaAnualNum)) newErrors.taxa = "Preencha este campo.";
    else if (taxaAnualNum < -50 || taxaAnualNum > 200) newErrors.taxa = "Taxa anual fora do intervalo (-50% a 200%).";

    if (descontarInflacao) {
      if (Number.isNaN(inflacaoAnualNum)) newErrors.inflacao = "Preencha este campo.";
      else if (inflacaoAnualNum < 0 || inflacaoAnualNum > 100) newErrors.inflacao = "Inflação deve estar entre 0% e 100%.";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return { total: 0, totalAportado: 0, juros: 0 };
    }

    const taxaNominal = taxaAnualNum / 100;
    const inflacaoNominal = descontarInflacao ? inflacaoAnualNum / 100 : 0;
    // taxa real aproximada: (1+taxa)/(1+inf)-1
    const taxaReal = (1 + taxaNominal) / (1 + inflacaoNominal) - 1;
    const r = (descontarInflacao ? taxaReal : taxaNominal) / 12; // taxa mensal efetiva utilizada
    const n = anosNum * 12; // meses
    const fvInicial = aporteInicialNum * Math.pow(1 + r, n);
    const fvAportes = aporteMensalNum * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const total = fvInicial + fvAportes;
    const totalAportado = aporteInicialNum + aporteMensalNum * n;
    const juros = total - totalAportado;
    return { total, totalAportado, juros };
  }, [aporteInicial, aporteMensal, taxaAnual, anos, descontarInflacao, inflacaoAnual]);

  return (
    <div className="container">
      <div className="stack" style={{ gap: 16 }}>
        <h2>Calculadora de Investimentos</h2>
        <p className="muted">Calcule o valor futuro dos seus investimentos com aportes mensais.</p>

        <div className="card stack">
          <div className="row">
            <label className="stack" style={{ flex: 1 }}>
              <span>Moeda</span>
              <select value={moeda} onChange={(e) => setMoeda(e.target.value as Moeda)}>
                <option value="BRL">BRL (R$)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CHF">CHF (Fr.)</option>
              </select>
            </label>
          </div>
          <div className="row">
            <label className="stack" style={{ flex: 1 }}>
              <span>Aporte inicial</span>
              <input
                type="number"
                min={0}
                step={100}
                value={aporteInicial}
                onChange={(e) => setInvestment({ ...investment, aporteInicial: e.target.value })}
              />
              {errors.aporteInicial && <span className="error">{errors.aporteInicial}</span>}
            </label>
            <label className="stack" style={{ flex: 1 }}>
              <span>Aporte mensal</span>
              <input
                type="number"
                min={0}
                step={50}
                value={aporteMensal}
                onChange={(e) => setInvestment({ ...investment, aporteMensal: e.target.value })}
              />
              {errors.aporteMensal && <span className="error">{errors.aporteMensal}</span>}
            </label>
          </div>
          <div className="row">
            <label className="stack" style={{ flex: 1 }}>
              <span>Taxa anual (%)</span>
              <input
                type="number"
                min={-50}
                max={200}
                step={0.1}
                value={taxaAnual}
                onChange={(e) => setInvestment({ ...investment, taxaAnual: e.target.value })}
              />
              {errors.taxa && <span className="error">{errors.taxa}</span>}
            </label>
            <label className="stack" style={{ flex: 1 }}>
              <span>Prazo (anos)</span>
              <input
                type="number"
                min={1}
                max={50}
                value={anos}
                onChange={(e) => setInvestment({ ...investment, anos: e.target.value })}
              />
              {errors.anos && <span className="error">{errors.anos}</span>}
            </label>
          </div>

          <div className="row" style={{ alignItems: "flex-end" }}>
            <label className="row" style={{ alignItems: "center" }}>
              <input
                type="checkbox"
                checked={descontarInflacao}
                onChange={(e) => setInvestment({ ...investment, descontarInflacao: e.target.checked })}
                style={{ marginRight: 8 }}
              />
              Descontar inflação
            </label>
            {descontarInflacao && (
              <label className="stack" style={{ flex: 1 }}>
                <span>Inflação anual (%)</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={inflacaoAnual}
                  onChange={(e) => setInvestment({ ...investment, inflacaoAnual: e.target.value })}
                  title="BR: IPCA (IBGE/Banco Central) • PT/EUR: HICP (Eurostat/INE) • US: CPI (BLS)"
                />
                <span className="textIPCA text-xl">Ex.: utilize o IPCA (BR): pesquisar &apos;IPCA 2024 Banco Central&apos; ou HICP (UE): &apos;taxa de inflação anual Eurostat&apos;</span>
                {errors.inflacao && <span className="error">{errors.inflacao}</span>}
              </label>
            )}
          </div>
        </div>

        <div className="card stack result">
          <h3>Resultado</h3>
          <p>Valor futuro estimado: <strong>{formatCurrency(resultado.total, moeda)}</strong></p>
          <p>Total aportado: {formatCurrency(resultado.totalAportado, moeda)}</p>
          <p>Juros acumulados: {formatCurrency(resultado.juros, moeda)}</p>
          {descontarInflacao && (
            <p className="muted">Valores ajustados pela inflação informada.</p>
          )}
        </div>
      </div>
    </div>
  );
}


