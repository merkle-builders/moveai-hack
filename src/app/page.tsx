"use client";

import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { useWallet } from "@aptos-labs/wallet-adapter-react";
// import { AccountInfo } from "@/components/AccountInfo";
import Link from "next/link";

function App() {
  // const { connected } = useWallet();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header remains at the top */}
      <Header />

      {/* Content wrapper that takes remaining height and centers the card */}
      <div className="flex-grow flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">💰</span>
              <span>Money Buddy</span>
            </CardTitle>
            <CardDescription>Your AI-powered DeFi assistant on Aptos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Money Buddy can help you with various DeFi tasks on the Aptos blockchain:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Send tokens between addresses</li>
                <li>Swap tokens using liquidity pools</li>
                <li>Stake tokens in supported protocols</li>
                <li>Combine actions like swap+send</li>
                <li>Track your portfolio</li>
              </ul>
              <div className="pt-2 space-y-2">
                <Button asChild className="w-full">
                  <Link href="/chat">Chat with Money Buddy</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
