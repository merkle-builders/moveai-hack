import { WalletSelector } from "@/components/WalletSelector";
import Link from "next/link";
import { CircleUserRound } from "lucide-react";

export function Header() {
  return (
    <header className="border-b py-4">
      <div className="container mx-auto max-w-7xl px-4 flex items-center">
        <div className="flex justify-start">
          <Link href="/" className="text-2xl font-bold">
            Money Buddy
          </Link>
        </div>
        <div className="flex ml-auto gap-9">
          <WalletSelector />
          <div className="flex mt-1 hover:cursor-pointer hover:bg-blue-100 hover:rounded-xl transition-all items-center justify-center w-8 h-8">
            <CircleUserRound />
          </div>
        </div>
      </div>
    </header>
  );
}
