"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@/components/WalletSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Lock, AlertCircle } from "lucide-react";
import { Header } from "@/components/Header";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const { connected, account } = useWallet();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi, I'm Money Buddy! I specialize in helping you create and manage Emojicoins on the Aptos blockchain. I can help you launch your own Emojicoin, manage markets, provide liquidity, and set up AI-powered Twitter promotion for your coin. Want to create your own Emojicoin or need help with social media promotion? Let me know how I can assist you!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set privateKey from environment variable
    setPrivateKey(process.env.NEXT_PUBLIC_MODULE_PUBLISHER_ACCOUNT_PRIVATE_KEY || "");
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    if (!connected) {
      setMessages([
        ...messages,
        { role: "user", content: input },
        { role: "assistant", content: "Please connect your wallet to use Money Buddy." },
      ]);
      setInput("");
      return;
    }

    if (!privateKey) {
      setMessages([
        ...messages,
        { role: "user", content: input },
        {
          role: "assistant",
          content:
            "Please enter your private key to use Money Buddy. This is required for executing transactions on your behalf.",
        },
      ]);
      setInput("");
      return;
    }

    setLoading(true);
    const userMessage = input;
    setMessages([...messages, { role: "user", content: userMessage }]);
    setInput("");

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          walletAddress: account?.address,
          privateKey: privateKey,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${data.error || "Something went wrong"}` },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, there was an error processing your request. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      {/* Main chat container */}
      <div className="flex-grow flex flex-col p-4 relative">
        {/* Background glow effect */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[100px] z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

        <div className="max-w-4xl w-full mx-auto z-10 flex flex-col h-full">
          {/* Connection status */}
          <div className="mb-4 flex justify-between items-center border-b border-blue-900/30 pb-4">
            <div className="flex items-center space-x-4">
              <div className="bg-black/60 border border-blue-500/30 rounded-md p-2 backdrop-blur-sm glow-blue-subtle">
                <span className="text-xl mr-2">💰</span>
                <span className="text-blue-400 font-bold">Money Buddy Chat</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <WalletSelector />
              {connected && (
                <div className="text-sm px-3 py-1 rounded-full bg-green-900/30 border border-green-500/30 text-green-400">
                  {account?.address
                    ? `Connected: ${String(account.address).slice(0, 6)}...${String(account.address).slice(-4)}`
                    : "Not connected"}
                </div>
              )}
            </div>
          </div>

          {/* Private key input */}
          {connected && !privateKey && (
            <div className="mb-6 bg-black/60 border border-yellow-500/30 rounded-md p-4 backdrop-blur-sm">
              <div className="flex items-center mb-2 text-yellow-400">
                <AlertCircle className="h-5 w-5 mr-2" />
                <label htmlFor="privateKey" className="font-medium">
                  Enter your private key (stored only in your browser session):
                </label>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500/50" />
                  <Input
                    id="privateKey"
                    type="password"
                    value={privateKey}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrivateKey(e.target.value)}
                    placeholder="Enter your private key"
                    className="pl-10 bg-black/60 border-blue-500/30 text-white"
                  />
                </div>
                <Button
                  onClick={() => setPrivateKey("")}
                  variant="outline"
                  size="sm"
                  className="border-blue-500/30 text-blue-400 hover:bg-blue-900/20"
                >
                  Clear
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Your private key is required for executing transactions and is never stored on our servers. The key will
                be automatically formatted to be AIP-80 compliant.
              </p>
            </div>
          )}

          {/* Messages container */}
          <div className="flex-grow overflow-y-auto mb-4 custom-scrollbar bg-black/40 border border-blue-900/30 rounded-md p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} message-animation`}
                >
                  {message.role === "assistant" && (
                    <div className="h-8 w-8 rounded-full bg-blue-900/50 border border-blue-500/50 flex items-center justify-center mr-2 glow-blue-subtle">
                      <span className="text-sm">💰</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-blue-900/30 border border-blue-500/30 text-white"
                        : "bg-black/60 border border-blue-500/20 text-gray-200"
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.role === "user" && (
                    <div className="h-8 w-8 rounded-full bg-blue-600/30 border border-blue-400/50 flex items-center justify-center ml-2">
                      <span className="text-xs">YOU</span>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          <div className="bg-black/60 border border-blue-900/30 rounded-md p-3 backdrop-blur-sm">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                placeholder="Ask Money Buddy about DeFi operations..."
                className="flex-1 resize-none bg-black/60 border-blue-500/30 text-white placeholder:text-gray-500 min-h-[60px]"
                onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white border-none self-end h-[60px] w-[60px]"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 text-center text-xs text-blue-500/70">
            <p>UNIVERSAL BLOCKCHAIN • UNIVERSAL LANGUAGE • UNIVERSAL OWNERSHIP</p>
          </div>
        </div>
      </div>
    </div>
  );
}
