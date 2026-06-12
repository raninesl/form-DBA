import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Candidature - DBA Genève",
  description: "Formulaire de candidature en ligne pour DBA Genève",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
