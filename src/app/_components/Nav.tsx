"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Início" },
  { href: "/quiz", label: "Perfil Investidor" },
  { href: "/calculadora", label: "Calculadora de Investimentos" },
  { href: "/calculadora-dividendos", label: "Calculadora de Dividendos" },
];

export function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="row tabs" aria-label="Navegação principal" style={{ marginTop: 12 }}>
      {links.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`tab ${active ? "tab--active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}


