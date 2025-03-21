import { aptosClient } from "@/utils/aptosClient";

export type AccountAPTBalanceArguments = {
  accountAddress: string;
};

export const getAccountAPTBalance = async (args: AccountAPTBalanceArguments): Promise<number> => {
  const { accountAddress } = args;
  try {
    const balance = await aptosClient().view<[number]>({
      payload: {
        function: "0x1::coin::balance",
        typeArguments: ["0x1::aptos_coin::AptosCoin"],
        functionArguments: [accountAddress],
      },
    });
    return balance[0];
  } catch (error) {
    console.error("Error fetching APT balance:", error);
    return 0;
  }
};
