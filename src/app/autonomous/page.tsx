"use client";

import { Header } from '@/components/Header';
import AutonomousOperations from '@/components/AutonomousOperations';

export default function AutonomousPage() {
  return (
    <div className="container mx-auto p-4">
      <Header />
      <div className="mt-8">
        <h1 className="text-3xl font-bold mb-6">Autonomous DeFi Operations</h1>
        <p className="text-gray-600 mb-8">
          Configure and manage autonomous DeFi operations on the Aptos blockchain. Set up portfolio management strategies, 
          find the best yield opportunities, and execute automated trading strategies.
        </p>
        <AutonomousOperations />
      </div>
    </div>
  );
} 