import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Football App",
  description: "Aplicación para organizar partidos, equipos y eliminatorias",
};

const links = [
  { href: "/", label: "Inicio" },
  { href: "/teams", label: "Equipos" },
  { href: "/players", label: "Jugadores" },
  { href: "/matches", label: "Partidos" },
  { href: "/knockout", label: "Eliminatorias" },
];

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-slate-950 text-white flex flex-col">
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 font-bold shadow-lg shadow-indigo-500/30">
                ⚽
              </div>

              <div>
                <p className="text-lg font-bold leading-none">Football App</p>
                <p className="text-xs text-slate-400">Mundial 2026</p>
              </div>
            </Link>

            <div className="flex flex-wrap gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-indigo-500 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="flex-1">{children}</div>

        <footer className="border-t border-white/10 bg-slate-900">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-bold">Football App</p>
              <p className="mt-1 text-sm text-slate-400">
                Proyecto Next.js con rutas, componentes, estado global y consumo
                de API.
              </p>
            </div>

            <div className="text-sm text-slate-400">
              <p>TP N° 2 - Componentes y APIs</p>
              <p className="mt-1">Mundial 2026</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}