import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ReactQueryProvider } from "@/components/ReactQueryProvider";
import { WalletProvider } from "@/components/WalletProvider";
import { Toaster } from "@/components/ui/toaster";
import { WrongNetworkAlert } from "@/components/WrongNetworkAlert";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/star-background";

import "./globals.css";

export const metadata: Metadata = {
  applicationName: "Money Buddy",
  title: "Money Buddy",
  description: "Money Buddy AI is your AI buddy on Money chain",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <ReactQueryProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
              <StarsBackground />
              <ShootingStars />
              <div className="z-10 h-screen" id="root">
                {children}
              </div>
            </ThemeProvider>
            <WrongNetworkAlert />
            <Toaster />
          </ReactQueryProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
