import { WalletSelector } from '@/components/WalletSelector';
import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b py-4">
      <div className="container mx-auto max-w-7xl px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Money Buddy
        </Link>
        <WalletSelector />
      </div>
    </header>
  );
}
