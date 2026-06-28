import type { Metadata } from "next";
import {
  Inter,
  Geist_Mono,
  Fraunces,
  Space_Grotesk,
  Nunito,
  Quicksand,
} from "next/font/google";
import "./globals.css";

// 5 familles chargées en variables CSS neutres. Le thème typo actif (data-typo sur <html>)
// décide lesquelles alimentent --font-sans (corps) et --font-display (titres), cf. globals.css.
// Geist Mono reste fixe pour les données chiffrées.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space", subsets: ["latin"] });
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });
const quicksand = Quicksand({ variable: "--font-quicksand", subsets: ["latin"] });

const fontVars = [
  inter.variable,
  geistMono.variable,
  fraunces.variable,
  spaceGrotesk.variable,
  nunito.variable,
  quicksand.variable,
].join(" ");

export const metadata: Metadata = {
  title: "Cycle Maxxing",
  description: "Suivi du cycle de Julie — phase, stats du jour et conseils.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Thème dark + thème typo « editorial » par défaut (docs/04). Le script inline restaure
  // le thème typo sauvegardé AVANT le paint → pas de flash de police au chargement.
  return (
    <html
      lang="fr"
      data-typo="editorial"
      // Le script inline ci-dessous modifie <html> (data-typo + vars de police) avant
      // l'hydratation → on supprime l'avertissement de mismatch attendu sur cette balise.
      suppressHydrationWarning
      className={`dark ${fontVars} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('typo')||'editorial';var F={editorial:['var(--font-inter)','var(--font-fraunces)'],grotesk:['var(--font-space)','var(--font-space)'],doux:['var(--font-nunito)','var(--font-quicksand)']};var f=F[t]||F.editorial;var e=document.documentElement;e.style.setProperty('--active-body',f[0]);e.style.setProperty('--active-title',f[1]);e.setAttribute('data-typo',t)}catch(e){}",
          }}
        />
        {children}
      </body>
    </html>
  );
}
