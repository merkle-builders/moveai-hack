import { type SymbolEmoji, getMarketAddress } from "@econia-labs/emojicoin-sdk"
import type { AgentRuntime } from "../../agent"

/**
 * Remove liquidity for emojis coins
 * @param agent MoveAgentKit instance
 * @param emojis Emojicoin to remove liquidity
 * @param amount Amount of emojis to remove liquidity
 * @example
 * ```ts
 * const transaction = await removeLiquidityEmojicoins(agent, emojis, amount);
 * ```
 */
export async function removeLiquidityEmojicoin(
	agent: AgentRuntime,
	emojis: SymbolEmoji[],
	amount: number
): Promise<{ hash: string }> {
	try {
		const marketAddress = getMarketAddress(emojis).toString()

		const committedTransactionHash = await agent.account.sendTransaction({
			sender: agent.account.getAddress(),
			data: {
				function:
					"0x1abfa4c5bb5f381b00719fc19e8e655cb2531904bf8f59309efd18eb081373b4::emojicoin_dot_fun::remove_liquidity",
				typeArguments: [`${marketAddress}::coin_factory::Emojicoin`, `${marketAddress}::coin_factory::EmojicoinLP`],
				functionArguments: [marketAddress.toString(), amount, 1],
			},
		})

		const signedTransaction = await agent.aptos.waitForTransaction({
			transactionHash: committedTransactionHash,
		})

		if (!signedTransaction) {
			throw new Error("Failed to remove liquidity emojicoins")
		}

		return {
			hash: signedTransaction.hash,
		}
	} catch (error: any) {
		throw new Error(`Failed to remove liquidity: ${error.message}`)
	}
}