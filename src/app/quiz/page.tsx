"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useCalculators } from "../_providers/CalculatorsProvider";

type OptionKey = "a" | "b" | "c";

type Question = {
  id: number;
  text: string;
  options: { key: OptionKey; label: string }[];
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    text:
      "Como reagiria perante uma situação inesperada de notícias negativas no mercado de capitais?",
    options: [
      { key: "a", label: "Não faria nada e ficaria a assistir ao desenrolar dos acontecimentos." },
      { key: "b", label: "Acompanharia a situação de perto e talvez vendesse parte da minha carteira." },
      { key: "c", label: "Vendia todos os ativos que possuo." },
    ],
  },
  {
    id: 2,
    text:
      "Encararia com elevada preocupação perder a totalidade do capital investido ou até mais?",
    options: [
      { key: "a", label: "Estou habituado a investir em derivados e produtos alavancados como os CFD’s." },
      { key: "b", label: "Ligeira preocupação mas, invisto em produtos alavancados com cautela." },
      { key: "c", label: "Não admito nenhumas das duas hipóteses." },
    ],
  },
  {
    id: 3,
    text:
      "Qual a percentagem do rendimento do teu agregado familiar usado para pagar prestações mensais de empréstimos da casa, do carro, etc.?",
    options: [
      { key: "a", label: "Mais de 50%." },
      { key: "b", label: "Entre 25% e 50%." },
      { key: "c", label: "Menos de 25%." },
    ],
  },
  {
    id: 4,
    text:
      "Imagina que uma ação que compraste há seis meses está agora a subir 30%. Qual a tua atitude?",
    options: [
      { key: "a", label: "Não vendo e até pondero comprar mais." },
      { key: "b", label: "Vendo parte da carteira para realizar alguns ganhos." },
      { key: "c", label: "Vendo a totalidade das ações porque acho que já ganhei o suficiente." },
    ],
  },
  {
    id: 5,
    text:
      "Achas que a sorte protege os audazes e te pode ajudar a ganhar dinheiro na bolsa?",
    options: [
      { key: "a", label: "Sim." },
      { key: "b", label: "Às vezes." },
      { key: "c", label: "Não acredito que a sorte ajude no investimento em ações." },
    ],
  },
  {
    id: 6,
    text:
      "No caso de uma emergência, as tuas poupanças permitem-te viver desafogadamente durante quanto tempo?",
    options: [
      { key: "a", label: "Menos de 3 meses." },
      { key: "b", label: "De 3 meses a 1 ano." },
      { key: "c", label: "Mais de 1 ano." },
    ],
  },
  {
    id: 7,
    text:
      "Qual das seguintes afirmações melhor descreve a tua postura perante o investimento no mercado de capitais?",
    options: [
      { key: "a", label: "Prefiro uma carteira com uma maior percentagem de investimento em produtos alavancados e ações de empresas com elevado potencial de subida, mesmo que estas apresentem maior risco." },
      { key: "b", label: "Prefiro uma carteira equilibrada, da qual façam parte tanto ações como obrigações e outros ativos financeiros." },
      { key: "c", label: "Prefiro uma carteira apenas composta por ativos financeiros de risco reduzido como depósitos e obrigações e talvez algumas ações de elevada capitalização bolsista, que apresentam um comportamento mais estável e menos volátil." },
    ],
  },
  {
    id: 8,
    text: "Serias capaz de investir numa ação que te recomendaram?",
    options: [
      { key: "a", label: "Sim." },
      { key: "b", label: "Talvez, mas iria informar-me primeiro sobre o título." },
      { key: "c", label: "Não, os conselhos são apenas coisa de profissionais." },
    ],
  },
  {
    id: 9,
    text:
      "O que esperas que aconteça aos teus rendimentos provenientes do investimento em ações, nos próximos 6 anos?",
    options: [
      { key: "a", label: "Que aumentem para mais do triplo." },
      { key: "b", label: "Que aumentem cerca de 10% ao ano." },
      { key: "c", label: "Que aumentem mais do que a inflação, mas de uma forma consistente." },
    ],
  },
  {
    id: 10,
    text:
      "Qual o emprego que melhor se adequa ao teu espírito de trabalhador?",
    options: [
      { key: "a", label: "Um emprego muito bem pago, mas onde existe alguma instabilidade." },
      { key: "b", label: "Um emprego razoavelmente pago e seguro, mas longe de casa." },
      { key: "c", label: "Um emprego estável, seguro, perto de casa e em que o salário me chega para pagar as contas." },
    ],
  },
];

function scoreProfile(answers: OptionKey[]) {
  const counts = answers.reduce(
    (acc, key) => {
      acc[key] += 1;
      return acc;
    },
    { a: 0, b: 0, c: 0 } as Record<OptionKey, number>
  );

  const max = Math.max(counts.a, counts.b, counts.c);
  const winner = (Object.keys(counts) as OptionKey[]).find(
    (k) => counts[k] === max
  ) as OptionKey;

  if (winner === "a") {
    return {
      key: "agressivo" as const,
      title: "Perfil Agressivo",
      description:
        "Aceitas maior risco em troca de potencial de retorno superior. Podes tolerar volatilidade e perdas temporárias, privilegiando crescimento a longo prazo.",
    };
  }
  if (winner === "b") {
    return {
      key: "moderado" as const,
      title: "Perfil Moderado",
      description:
        "Equilibras risco e retorno. Preferes uma carteira diversificada com ações e obrigações, mantendo foco na consistência.",
    };
  }
  return {
    key: "conservador" as const,
    title: "Perfil Conservador",
    description:
      "Privilegias segurança do capital e estabilidade. Preferes soluções de menor risco e volatilidade reduzida.",
  };
}

export default function QuizPage() {
  const { quiz, setQuiz, resetQuiz } = useCalculators();
  const { current, answers, submitted } = quiz;

  const progressPercent = Math.round(((current + 1) / QUESTIONS.length) * 100);
  const canGoNext = answers[current] !== null;

  const result = useMemo(() => {
    const completed = answers.every((a) => a !== null);
    if (!submitted || !completed) return null;
    return scoreProfile(answers as OptionKey[]);
  }, [answers, submitted]);

  const onSelect = (key: OptionKey) => {
    const next = [...answers];
    next[current] = key;
    setQuiz({ ...quiz, answers: next });
  };

  const goNext = () => {
    if (current < QUESTIONS.length - 1) setQuiz({ ...quiz, current: current + 1 });
  };

  const goPrev = () => {
    if (current > 0) setQuiz({ ...quiz, current: current - 1 });
  };

  const onSubmit = () => {
    setQuiz({ ...quiz, submitted: true });
  };

  const q = QUESTIONS[current];

  return (
    <div className="container">
      <div className="stack" style={{ gap: 16 }}>

        <div className="card stack">
          <h3>Como funciona?</h3>
          <p>
            Você responderá 10 perguntas de múltipla escolha. Exibimos uma pergunta
            de cada vez para facilitar a leitura e a tomada de decisão. No fim,
            calculamos o seu perfil e mostramos uma breve descrição.
          </p>
        </div>

        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2>Questionário de Perfil de Investidor</h2>
          <button onClick={resetQuiz} className="btn btn-secondary" aria-label="Voltar para início">Recomeçar</button>
        </div>
        
        <div className="progress" aria-label="Progresso">
          <div
            className="progress__bar"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="muted">Pergunta {current + 1} de {QUESTIONS.length}</p>

        <div className="card stack">
          <div className="question">{q.text}</div>
          <div className="stack">
            {q.options.map((opt) => {
              const selected = answers[current] === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => onSelect(opt.key)}
                  className={`option ${selected ? "option--selected" : ""}`}
                  aria-pressed={selected}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="row" style={{ marginTop: 8 }}>
            <button onClick={goPrev} className="btn btn-secondary" disabled={current === 0}>
              Anterior
            </button>
            {current < QUESTIONS.length - 1 ? (
              <button onClick={goNext} className="btn" disabled={!canGoNext}>
                Próxima
              </button>
            ) : (
              <button onClick={onSubmit} className="btn" disabled={!canGoNext}>
                Concluir Questionário
              </button>
            )}
          </div>
        </div>

        {result && (
          <div className="card result stack">
            <h2>{result.title}</h2>
            <p>{result.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}


