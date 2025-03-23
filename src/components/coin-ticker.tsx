"use client";

import { useEffect, useRef } from "react";

interface Coin {
  symbol: string;
  name: string;
  change: number;
  color: string;
}

interface CoinTickerProps {
  coins: Coin[];
}

export function CoinTicker({ coins }: CoinTickerProps) {
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tickerElement = tickerRef.current;
    if (!tickerElement) return;

    const animateTicker = () => {
      if (!tickerElement) return;

      tickerElement.style.transform = "translateX(0)";
      const animationDuration = coins.length * 3; // 3 seconds per coin

      tickerElement.style.transition = `transform ${animationDuration}s linear`;
      const distance = tickerElement.scrollWidth;

      setTimeout(() => {
        tickerElement.style.transform = `translateX(-${distance}px)`;
      }, 100);

      // Reset and restart animation
      setTimeout(() => {
        tickerElement.style.transition = "none";
        tickerElement.style.transform = "translateX(100%)";
        setTimeout(animateTicker, 100);
      }, animationDuration * 1000);
    };

    animateTicker();

    return () => {
      if (tickerElement) {
        tickerElement.style.transition = "none";
      }
    };
  }, [coins]);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex absolute whitespace-nowrap" ref={tickerRef} style={{ transform: "translateX(100%)" }}>
        {[...coins, ...coins].map((coin, index) => (
          <div
            key={index}
            className="inline-flex items-center px-4 py-1 mx-2 rounded-full bg-black border border-gray-800"
          >
            <span className="mr-2 text-xl">{coin.symbol}</span>
            <span className="mr-2 text-gray-400">{coin.name}</span>
            <span className={coin.change >= 0 ? "text-green-500" : "text-red-500"}>
              {coin.change >= 0 ? "+" : ""}
              {coin.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
