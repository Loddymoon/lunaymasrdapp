import type { Metadata } from "next";
import { Baloo_2 } from "next/font/google";
import "./globals.css";

const baloo2 = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "HablaPronto — Que tu hijo hable claro, 5 minutos al día",
  description:
    "Retos diarios de 5 minutos, por la edad exacta de tu hijo, con voces reales — sin cobros sorpresa. Estimulación del habla para niños de 1 a 4 años.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${baloo2.variable} h-dvh antialiased`}>
      <body className="min-h-dvh flex flex-col bg-[var(--bg)] text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}
