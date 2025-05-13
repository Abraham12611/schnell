import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./test.css";
import Header from "@/components/Header";
import ContextProvider from "@/context/ContextProvider";
import { headers } from "next/headers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Schnell Remittance",
  description: "Lowest Fees, Fastest Speeds on Mantle",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie = (await headers()).get('cookie');

  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <head>
        {/* Fallback styles in case Tailwind isn't applying properly */}
        <style dangerouslySetInnerHTML={{ __html: `
          body {
            background-color: #0E1116;
            color: white;
          }
        `}} />
      </head>
      <body className="flex flex-col min-h-screen bg-brand-charcoal">
        <ContextProvider cookies={cookie}>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
        </ContextProvider>
      </body>
    </html>
  );
}
