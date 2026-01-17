import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Child Needs - Liste des besoins",
  description: "Application de gestion des listes d'éléments à apporter pour les enfants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
