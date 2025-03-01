import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { getAccountAPTBalance } from "@/view-functions/getAccountBalance";

export function AccountInfo() {
  const { account } = useWallet();
  const [formattedBalance, setFormattedBalance] = useState<string>('Loading...');
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["apt-balance", account?.address],
    refetchInterval: 10_000,
    enabled: !!account,
    queryFn: async () => {
      try {
        if (!account) {
          return { balance: 0 };
        }

        const balance = await getAccountAPTBalance({ 
          accountAddress: account.address.toString() 
        });

        return { balance };
      } catch (error) {
        console.error('Error fetching balance:', error);
        return { balance: 0 };
      }
    },
  });

  useEffect(() => {
    setLoading(isLoading);
    
    if (data) {
      // APT has 8 decimal places
      const aptBalance = data.balance / Math.pow(10, 8);
      setFormattedBalance(`${aptBalance.toFixed(4)} APT`);
    }
  }, [data, isLoading]);

  if (!account) {
    return <div>No account connected</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-500">Address</h3>
        <p className="break-all">{account.address.toString()}</p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500">Balance</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <p>{formattedBalance}</p>
        )}
      </div>
    </div>
  );
}
