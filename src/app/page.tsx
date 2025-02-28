"use client";

import { Header } from "@/components/Header";

// Internal Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AccountInfo } from "@/components/AccountInfo";
function App() {
  const { connected } = useWallet();

  return (
    <>
      <Header />
      <div className="flex items-center justify-center flex-col">
        {/* <MatrixBackground/> */}
        {connected ? (
          <Card>
            <CardContent>
              <AccountInfo />
            </CardContent>
          </Card>
        ) : (
          <CardHeader>
            <CardTitle>To get started Connect a wallet</CardTitle>
          </CardHeader>
        )}
      </div>
    </>
  );
}

export default App;
