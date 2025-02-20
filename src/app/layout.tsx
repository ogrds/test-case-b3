import "@/styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StoreProvider from "@/providers/store-provider";
import { ThemeProvider } from "@/providers/theme-provider";

import { availableThemes } from "@/styles/themes";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "B3 Digitas - Frontend Test Case",
  description: "Generated by create next app",
  authors: [
    {
      name: "Gabriel Ribeiro",
      url: "https://ogrds.dev/",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className={`${inter.className} antialiased`}>
          <Toaster />
          <ThemeProvider
            themes={Object.keys(availableThemes) ?? []}
            attribute="data-theme"
            defaultTheme="system"
            enableSystem
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </StoreProvider>
  );
}
