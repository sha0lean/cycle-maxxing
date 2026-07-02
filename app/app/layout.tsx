import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { HormoneThemeStyle } from "@/components/HormoneThemeStyle";
import "./globals.css";

// Système typo unique (« Éphéméride corporelle ») : Instrument Serif en display haute-tension,
// Geist en corps, Geist Mono pour les données chiffrées (jours, graduations, jauges).
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
// Instrument Serif n'existe qu'en 400 (et italique) — c'est son grain, pas une limite.
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  subsets: ["latin"],
});

const fontVars = [geist.variable, geistMono.variable, instrument.variable].join(" ");

export const metadata: Metadata = {
  title: "Cycle Maxxing",
  description: "Suivi du cycle de Julie — phase, stats du jour et conseils.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Thème nuit chaude (`dark`) par défaut, une seule identité typo → plus de script de restauration.
  return (
    <html lang="fr" className={`dark ${fontVars} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <HormoneThemeStyle />
        {children}
      </body>
    </html>
  );
}
