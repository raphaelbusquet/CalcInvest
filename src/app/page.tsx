import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <div className="stack" style={{ gap: 20 }}>
        <header className="stack" style={{ gap: 8 }}>
          <h2>Calc Invest. Sua melhor companheira quando o assunto é previsibilidade de investimentos.</h2>
          <p className="muted">
            Um espaço simples e direto para calcular cenários
            de investimentos e entender o seu perfil de risco. Explore as ferramentas
            nas abas acima.
          </p>
        </header>

        <div className="card stack">
          <h3>O que você encontra aqui</h3>
          <p>
            - Perfil de Investidor: responda um questionário e conheça o seu perfil (conservador, moderado ou agressivo).
          </p>
          <p>
            - Calculadora de Investimentos: simule aportes, prazo e taxa para estimar o valor futuro.
          </p>
          <p>
            - Calculadora de Dividendos: calcule quantas cotas, e o quanto você precisa investir para receber o valor desejado em dividendos.
          </p>
          <div>
            <Link href="/quiz" className="btn" aria-label="Ir para Perfil de Investidor">
              Ir para Perfil de Investidor
            </Link>
          </div>
        </div>

        <footer className="muted">
          <small>
            Nota: o resultado é indicativo e não constitui recomendação de investimento.
          </small>
        </footer>
      </div>
    </div>
  );
}
