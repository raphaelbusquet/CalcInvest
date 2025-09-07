"use client";

import { useMemo } from "react";
import { useCurrency } from "../_providers/CurrencyProvider";
import { useCalculators } from "../_providers/CalculatorsProvider";

type DividendFrequency = "mensal" | "trimestral" | "semestral" | "anual";

function formatCurrency(n: number, currency: string) {
  const locale = currency === "EUR" ? "pt-PT" : "pt-BR";
  return n.toLocaleString(locale, { style: "currency", currency });
}

export default function CalculadoraDividendosPage() {
  const { moeda } = useCurrency();
  const { dividends, setDividends } = useCalculators();
  const {
    rendaMensalDesejada,
    frequencia,
    dividendYield,
    precoAcao,
    incluirImposto,
    aliquotaImposto,
  } = dividends;

  const resultado = useMemo(() => {
    const rendaMensalNum = rendaMensalDesejada === "" ? NaN : Number(rendaMensalDesejada);
    const yieldNum = dividendYield === "" ? NaN : Number(dividendYield);
    const precoNum = precoAcao === "" ? NaN : Number(precoAcao);
    const impostoNum = aliquotaImposto === "" ? NaN : Number(aliquotaImposto);

    if (Number.isNaN(rendaMensalNum) || Number.isNaN(yieldNum) || Number.isNaN(precoNum)) {
      return null;
    }

    // Calcular renda anual desejada baseado na frequência
    let rendaAnualDesejada: number;
    switch (frequencia) {
      case "mensal":
        rendaAnualDesejada = rendaMensalNum * 12;
        break;
      case "trimestral":
        rendaAnualDesejada = rendaMensalNum * 4;
        break;
      case "semestral":
        rendaAnualDesejada = rendaMensalNum * 2;
        break;
      case "anual":
        rendaAnualDesejada = rendaMensalNum;
        break;
    }

    // Se incluir imposto, calcular renda bruta necessária
    let rendaAnualBruta: number;
    if (incluirImposto && !Number.isNaN(impostoNum)) {
      // Fórmula: Renda Bruta = Renda Líquida / (1 - Alíquota/100)
      rendaAnualBruta = rendaAnualDesejada / (1 - impostoNum / 100);
    } else {
      rendaAnualBruta = rendaAnualDesejada;
    }

    // Calcular capital necessário usando yield anual
    const capitalNecessario = rendaAnualBruta / (yieldNum / 100);

    // Calcular número de cotas
    const numeroCotas = Math.ceil(capitalNecessario / precoNum);

    // Calcular valor total do investimento
    const valorTotalInvestimento = numeroCotas * precoNum;

    // Calcular dividendos anuais que serão recebidos
    const dividendosAnuaisRecebidos = (valorTotalInvestimento * yieldNum) / 100;

    // Calcular dividendos líquidos (após imposto)
    let dividendosLiquidosAnuais: number;
    if (incluirImposto && !Number.isNaN(impostoNum)) {
      dividendosLiquidosAnuais = dividendosAnuaisRecebidos * (1 - impostoNum / 100);
    } else {
      dividendosLiquidosAnuais = dividendosAnuaisRecebidos;
    }

    return {
      rendaAnualDesejada,
      rendaAnualBruta,
      capitalNecessario,
      numeroCotas,
      valorTotalInvestimento,
      dividendosAnuaisRecebidos,
      dividendosLiquidosAnuais,
      rendaMensalLiquida: dividendosLiquidosAnuais / 12,
    };
  }, [rendaMensalDesejada, frequencia, dividendYield, precoAcao, incluirImposto, aliquotaImposto]);

  return (
    <div className="container">
      <div className="stack" style={{ gap: 16 }}>
        <h2>Calculadora de Dividendos</h2>
        <p className="muted">
          Calcule quantas cotas, e o quanto você precisa investir para receber o valor desejado em dividendos.
        </p>

        <div className="card stack">
          <div className="row">
            <label className="stack" style={{ flex: 1 }}>
              <span>Renda mensal desejada (líquida)</span>
              <input
                type="number"
                min={0}
                step={100}
                value={rendaMensalDesejada}
                onChange={(e) => setDividends({ ...dividends, rendaMensalDesejada: e.target.value })}
                placeholder="3000"
              />
            </label>
            <label className="stack" style={{ flex: 1 }}>
              <span>Frequência dos dividendos</span>
              <select
                value={frequencia}
                onChange={(e) => setDividends({ ...dividends, frequencia: e.target.value as DividendFrequency })}
              >
                <option value="mensal">Mensal</option>
                <option value="trimestral">Trimestral</option>
                <option value="semestral">Semestral</option>
                <option value="anual">Anual</option>
              </select>
            </label>
          </div>

          <div className="row">
            <label className="stack" style={{ flex: 1 }}>
              <span>Dividend yield anual (%)</span>
              <input
                type="number"
                min={0}
                max={50}
                step={0.1}
                value={dividendYield}
                onChange={(e) => setDividends({ ...dividends, dividendYield: e.target.value })}
                placeholder="2.5"
              />
            </label>
            <label className="stack" style={{ flex: 1 }}>
              <span>Preço por cota/ação</span>
              <input
                type="number"
                min={0}
                step={0.01}
                value={precoAcao}
                onChange={(e) => setDividends({ ...dividends, precoAcao: e.target.value })}
                placeholder="100"
              />
            </label>
          </div>

          <div className="row" style={{ alignItems: "flex-end" }}>
            <label className="row" style={{ alignItems: "center" }}>
              <input
                type="checkbox"
                checked={incluirImposto}
                onChange={(e) => setDividends({ ...dividends, incluirImposto: e.target.checked })}
                style={{ marginRight: 8 }}
              />
              Incluir imposto de renda no cálculo
            </label>
            {incluirImposto && (
              <label className="stack" style={{ flex: 1 }}>
                <span>Alíquota do imposto (%)</span>
                <input
                  type="number"
                  min={0}
                  max={50}
                  step={1}
                  value={aliquotaImposto}
                  onChange={(e) => setDividends({ ...dividends, aliquotaImposto: e.target.value })}
                  placeholder="30"
                />
              </label>
            )}
          </div>
        </div>

        {resultado && (
          <div className="card stack result">
            <h3>Resultado</h3>
            <p>
              <strong>Renda anual desejada:</strong> {formatCurrency(resultado.rendaAnualDesejada, moeda)}
            </p>
            {incluirImposto && (
              <p>
                <strong>Renda anual bruta necessária:</strong> {formatCurrency(resultado.rendaAnualBruta, moeda)}
              </p>
            )}
            <p>
              <strong>Capital necessário:</strong> {formatCurrency(resultado.capitalNecessario, moeda)}
            </p>
            <p>
              <strong>Número de cotas necessárias:</strong> {resultado.numeroCotas.toLocaleString()}
            </p>
            <p>
              <strong>Valor total a investir:</strong> {formatCurrency(resultado.valorTotalInvestimento, moeda)}
            </p>
            <p>
              <strong>Dividendos anuais recebidos:</strong> {formatCurrency(resultado.dividendosAnuaisRecebidos, moeda)}
            </p>
            {incluirImposto && (
              <p>
                <strong>Dividendos líquidos anuais:</strong> {formatCurrency(resultado.dividendosLiquidosAnuais, moeda)}
              </p>
            )}
            <p>
              <strong>Renda mensal líquida:</strong> {formatCurrency(resultado.rendaMensalLiquida, moeda)}
            </p>
            <p className="muted">
              * Cálculo baseado no dividend yield e preço informados. Valores arredondados para cima.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
