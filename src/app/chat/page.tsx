"use client";

import { useState, useEffect, useRef } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { WalletSelector } from '@/components/WalletSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const { connected, account } = useWallet();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi, I\'m Money Buddy! I can help you with a wide range of DeFi operations on the Aptos blockchain, including token transfers, swaps, staking, lending, borrowing, liquidity provision, and more. I also offer autonomous capabilities for portfolio management, yield optimization, and trading strategies. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;
    
    if (!connected) {
      setMessages([
        ...messages,
        { role: 'user', content: input },
        { role: 'assistant', content: 'Please connect your wallet to use Money Buddy.' }
      ]);
      setInput('');
      return;
    }

    if (!privateKey) {
      setMessages([
        ...messages,
        { role: 'user', content: input },
        { role: 'assistant', content: 'Please enter your private key to use Money Buddy. This is required for executing transactions on your behalf.' }
      ]);
      setInput('');
      return;
    }

    setLoading(true);
    const userMessage = input;
    setMessages([...messages, { role: 'user', content: userMessage }]);
    setInput('');

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          walletAddress: account?.address,
          privateKey: privateKey
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error || 'Something went wrong'}` }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your request. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/money-buddy-logo.png" alt="Money Buddy" />
              <AvatarFallback>MB</AvatarFallback>
            </Avatar>
            Money Buddy
          </CardTitle>
          <CardDescription>Your AI assistant for DeFi operations on Aptos</CardDescription>
          <div className="flex justify-between items-center mt-4">
            <WalletSelector />
            {connected && (
              <div className="text-sm text-green-600">Connected: {account?.address.slice(0, 6)}...{account?.address.slice(-4)}</div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {connected && !privateKey && (
            <div className="mb-4">
              <label htmlFor="privateKey" className="block text-sm font-medium mb-1">
                Enter your private key (stored only in your browser session):
              </label>
              <div className="flex gap-2">
                <Input
                  id="privateKey"
                  type="password"
                  value={privateKey}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrivateKey(e.target.value)}
                  placeholder="Enter your private key"
                  className="flex-1"
                />
                <Button onClick={() => setPrivateKey('')} variant="outline" size="sm">
                  Clear
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Your private key is required for executing transactions and is never stored on our servers.
                The key will be automatically formatted to be AIP-80 compliant.
              </p>
            </div>
          )}
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full gap-2">
            <Textarea
              value={input}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
              placeholder="Ask Money Buddy about DeFi operations..."
              className="flex-1 resize-none"
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage} disabled={loading || !input.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 