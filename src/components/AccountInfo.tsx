import { useWallet } from "@aptos-labs/wallet-adapter-react";
// Internal components
import { LabelValueGrid, DisplayValue } from "@/components/LabelValueGrid";

export function AccountInfo() {
  const { account } = useWallet();
  
  console.log(account);
  console.log(account?.address);
  console.log(account?.address?.toString());
  
  return (
    <div className="flex flex-col gap-6">
      <h4 className="text-lg font-medium">Account Info</h4>
      <LabelValueGrid
        items={[
          {
            label: "Address",
            value: <DisplayValue value={String(account?.address || "Not Present")} isCorrect={!!account?.address} />,
          },
          {
            label: "Public key",
            value: (
              <DisplayValue 
                value={Array.isArray(account?.publicKey) ? account.publicKey[0] : (account?.publicKey || "Not Present")} 
                isCorrect={!!account?.publicKey} 
              />
            ),
          },
          {
            label: "ANS name",
            subLabel: "(only if attached)",
            value: <p>{account?.ansName ?? "Not Present"}</p>,
          },
        ]}
      />
    </div>
  );
}
