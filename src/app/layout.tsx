import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.scss";
import Header from "@/components/Header/Header";
import { EnvironmentProvider } from "@/context/EnvironmentContext";
import { PlantProvider } from "@/context/PlantContext";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/context/ToastContext";
import { DemoProvider } from "@/context/DemoContext";
import { DemoOverlay } from "@/demo/DemoOverlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plant Mate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem storageKey="plantmate-theme">
          <div className="appWrapper">
            <EnvironmentProvider>
              <PlantProvider>
                <ToastProvider>
                    <main className="pageContainer" data-demo="main-container">
                      <DemoProvider>
                      <Header />
                      {children}
                        <DemoOverlay />
                      </DemoProvider>
                    </main>
                </ToastProvider>
              </PlantProvider>
            </EnvironmentProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}