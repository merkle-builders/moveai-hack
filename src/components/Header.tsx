"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WalletSelector } from "@/components/WalletSelector";

export function Header() {
  return (
    <header className="w-full border-b border-blue-900/30 py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-blue-500 font-mono text-xl font-bold tracking-wider">
            EMOJAI.FUN
            <span className="ml-2 text-xs bg-blue-900/50 px-2 py-0.5 rounded">v0.5</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm">
          {["CHAT", "LAUNCH"].map((item) => (
            <Link key={item} href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              {"{ " + item + " }"}
            </Link>
          ))}

          <div className="[&>button]:bg-blue-900/50 [&>button]:hover:bg-blue-800 [&>button]:text-blue-300 [&>button]:border [&>button]:border-blue-500/50 [&>button]:font-mono [&>button]:tracking-wider">
            <WalletSelector />
          </div>
        </nav>

        <div className="md:hidden">
          <Button variant="outline" size="sm" className="border-blue-500/50 text-blue-400">
            Menu
          </Button>
        </div>
      </div>
    </header>
  );
}
