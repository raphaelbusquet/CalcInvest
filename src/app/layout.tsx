import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import { NavTabs } from "./_components/Nav";
import { CurrencyProvider } from "./_providers/CurrencyProvider";
import { ThemeProvider } from "./_providers/ThemeProvider";
import { CalculatorsProvider } from "./_providers/CalculatorsProvider";
import { HeaderCurrencySelect } from "./_components/HeaderCurrencySelect";
import { ThemeToggle } from "./_components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CalcInvest",
  description:
    "CalcInvest — sua maior companheira quando o assunto é previsibilidade de investimentos.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-theme="light">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <CurrencyProvider>
            <CalculatorsProvider>
            <header className="container" style={{ paddingTop: 24, paddingBottom: 0 }}>
              <div className="row" style={{ alignItems: "center", justifyContent: "space-between" }}>
                <h1>Bem vindo investidor!</h1>
                <div className="row" style={{ alignItems: "center" }}>
                  <HeaderCurrencySelect />
                  <ThemeToggle />
                </div>
              </div>
              <NavTabs />
            </header>
            <main>{children}</main>
            </CalculatorsProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
