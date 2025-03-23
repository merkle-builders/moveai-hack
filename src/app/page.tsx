"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CoinTicker } from "@/components/coin-ticker";
import { Header } from "@/components/Header";

// Sample coin data for the ticker
const SAMPLE_COINS = [
  { symbol: "🪙", name: "APTOS", change: -3.78, color: "text-red-500" },
  { symbol: "🦁", name: "LION", change: +10.09, color: "text-green-500" },
  { symbol: "💰", name: "MONEY", change: +6.2, color: "text-green-500" },
  { symbol: "🔥", name: "FIRE", change: -1.17, color: "text-red-500" },
  { symbol: "💎", name: "DIAMOND", change: +2.7, color: "text-green-500" },
  { symbol: "🚀", name: "ROCKET", change: +0.62, color: "text-green-500" },
  { symbol: "🌕", name: "MOON", change: -6.5, color: "text-red-500" },
  { symbol: "💸", name: "CASH", change: +1.8, color: "text-green-500" },
];

function App() {
  const [currentCoin, setCurrentCoin] = useState({
    name: "MONEY BUDDY",
    symbol: "💰",
    change: +10.09,
    marketCap: "20,493.64",
    volume24h: "17.92",
    volumeAllTime: "3,709.87",
  });

  const [currentEmoji, setCurrentEmoji] = useState("💰");
  const [isAnimating, setIsAnimating] = useState(false);
  const emojis = ["💰", "🪙", "💎", "🚀", "🔥", "🦁", "💸", "🌕"];

  useEffect(() => {
    const animationInterval = setInterval(() => {
      // Start animation out
      setIsAnimating(true);

      // Change emoji after exit animation completes
      setTimeout(() => {
        setCurrentEmoji((prev) => {
          const currentIndex = emojis.indexOf(prev);
          const nextIndex = (currentIndex + 1) % emojis.length;
          return emojis[nextIndex];
        });

        // Reset animation state for entrance animation
        setIsAnimating(false);
      }, 500); // Half of the animation duration
    }, 3000); // Total time between emoji changes

    return () => clearInterval(animationInterval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col">
      {/* Header */}
      <Header />

      {/* Ticker */}
      <div className="w-full overflow-hidden py-2 border-b border-blue-900/30">
        <CoinTicker coins={SAMPLE_COINS} />
      </div>

      {/* Main content */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 relative">
        {/* Background glow effect */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[100px] z-0"></div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full z-10">
          {/* Left side - Glowing globe with emoji */}
          <div className="flex items-center justify-center">
            <div className="relative w-[300px] h-[300px]">
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 glow-blue"></div>
              <div className="absolute inset-[20px] rounded-full border-2 border-blue-500/40 glow-blue"></div>
              <div className="absolute inset-[40px] rounded-full border-2 border-blue-500/50 glow-blue"></div>
              <div className="absolute inset-[60px] rounded-full border-2 border-blue-500/60 glow-blue"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`bg-black/80 rounded-full emoji-container ${!isAnimating ? "emoji-active" : ""}`}>
                  <div className="emoji-glow"></div>
                  <span
                    className={`text-6xl transition-all duration-1000 transform ${
                      isAnimating ? "opacity-0 scale-50 rotate-180" : "opacity-100 scale-100 rotate-0"
                    } hover:scale-110`}
                    key={currentEmoji}
                  >
                    {currentEmoji}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Coin info and chat card */}
          <div className="flex flex-col space-y-6">
            {/* Coin stats */}
            <div>
              <div className="flex items-center space-x-2 text-xl">
                <span className="text-gray-400">HOT</span>
                <span className="text-green-500">🔥 +{currentCoin.change}%</span>
              </div>

              <h1 className="text-5xl font-bold tracking-wider mt-2 text-white">{currentCoin.name}</h1>

              <div className="mt-4 space-y-1 text-lg">
                <div className="flex">
                  <span className="text-gray-400 w-36">MKT. CAP:</span>
                  <span className="text-white">{currentCoin.marketCap} $</span>
                </div>
                <div className="flex">
                  <span className="text-gray-400 w-36">24 HOUR VOL:</span>
                  <span className="text-white">{currentCoin.volume24h} ₳</span>
                </div>
                <div className="flex">
                  <span className="text-gray-400 w-36">ALL-TIME VOL:</span>
                  <span className="text-white">{currentCoin.volumeAllTime} ₳</span>
                </div>
              </div>
            </div>

            {/* Money Buddy Card */}
            <div className="bg-black/60 border border-blue-500/30 rounded-md p-6 backdrop-blur-sm glow-blue-subtle">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">💰</span>
                <h2 className="text-xl font-bold text-blue-400">Money Buddy</h2>
              </div>

              <p className="text-gray-300 mb-4">Your AI-powered DeFi assistant on Aptos</p>

              <ul className="space-y-2 mb-6">
                {[
                  "Send tokens between addresses",
                  "Swap tokens using liquidity pools",
                  "Stake tokens in supported protocols",
                  "Combine actions like swap+send",
                  "Track your portfolio",
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="text-blue-500">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none">
                <Link href="/chat">Chat with Money Buddy</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer ticker */}
      <div className="py-4 border-t border-blue-900/30 overflow-hidden">
        <div className="flex items-center justify-center space-x-4 text-blue-500 text-sm">
          <span className="flex items-center">
            <span className="mr-1">🌐</span> UNIVERSAL BLOCKCHAIN
          </span>
          <span className="flex items-center">
            <span className="mr-1">🌐</span> UNIVERSAL LANGUAGE
          </span>
          <span className="flex items-center">
            <span className="mr-1">🌐</span> UNIVERSAL OWNERSHIP
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
