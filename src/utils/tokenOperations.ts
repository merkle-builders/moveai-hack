import { AgentRuntime } from "move-agent-kit";
import { AccountAddress } from '@aptos-labs/ts-sdk';

// Define the token operations object
const tokenOperations = {
  /**
   * Send tokens to a specified address
   * @param agent The AgentRuntime instance
   * @param toAddress The recipient's address
   * @param amount The amount to send
   * @param tokenType The token type (defaults to APT)
   * @returns Result of the operation
   */
  sendTokens: async (agent: AgentRuntime, toAddress: string, amount: number, tokenType: string = "0x1::aptos_coin::AptosCoin") => {
    try {
      // Convert string address to AccountAddress if needed
      const recipientAddress = typeof toAddress === 'string' 
        ? AccountAddress.fromString(toAddress) 
        : toAddress;
        
      const txHash = await agent.transferTokens(recipientAddress, amount, tokenType);
      return {
        success: true,
        transactionHash: txHash,
        message: `Successfully sent ${amount} tokens to ${toAddress}`
      };
    } catch (error: any) {
      console.error("Error sending tokens:", error);
      return {
        success: false,
        message: `Failed to send tokens: ${error.message || 'Unknown error'}`
      };
    }
  },

  /**
   * Swap tokens using LiquidSwap
   * @param agent The AgentRuntime instance
   * @param fromToken The source token
   * @param toToken The target token
   * @param amount The amount to swap
   * @returns Result of the operation
   */
  swapTokens: async (agent: AgentRuntime, fromToken: string, toToken: string, amount: number) => {
    try {
      // Ensure token format is correct
      const fromTokenFormatted = fromToken as `${string}::${string}::${string}`;
      const toTokenFormatted = toToken as `${string}::${string}::${string}`;
      
      const txHash = await agent.swap(fromTokenFormatted, toTokenFormatted, amount, 0);
      return {
        success: true,
        transactionHash: txHash,
        message: `Successfully swapped ${amount} tokens from ${fromToken} to ${toToken}`
      };
    } catch (error: any) {
      console.error("Error swapping tokens:", error);
      return {
        success: false,
        message: `Failed to swap tokens: ${error.message || 'Unknown error'}`
      };
    }
  },

  /**
   * Stake tokens with Echo
   * @param agent The AgentRuntime instance
   * @param amount The amount to stake
   * @returns Result of the operation
   */
  stakeTokens: async (agent: AgentRuntime, amount: number) => {
    try {
      const txHash = await agent.stakeTokenWithEcho(amount);
      return {
        success: true,
        transactionHash: txHash,
        message: `Successfully staked ${amount} tokens`
      };
    } catch (error: any) {
      console.error("Error staking tokens:", error);
      return {
        success: false,
        message: `Failed to stake tokens: ${error.message || 'Unknown error'}`
      };
    }
  },

  /**
   * Swap tokens and send to an address in one operation
   * @param agent The AgentRuntime instance
   * @param fromToken The source token
   * @param toToken The target token
   * @param amount The amount to swap
   * @param toAddress The recipient's address
   * @returns Result of the operation
   */
  swapAndSendTokens: async (agent: AgentRuntime, fromToken: string, toToken: string, amount: number, toAddress: string) => {
    try {
      // First swap the tokens
      const swapResult = await tokenOperations.swapTokens(agent, fromToken, toToken, amount);
      
      if (!swapResult.success) {
        return swapResult;
      }
      
      // Then send the swapped tokens
      const sendResult = await tokenOperations.sendTokens(agent, toAddress, amount, toToken);
      
      return {
        success: sendResult.success,
        transactionHash: sendResult.transactionHash,
        message: `Successfully swapped and sent ${amount} tokens to ${toAddress}`
      };
    } catch (error: any) {
      console.error("Error in swap and send operation:", error);
      return {
        success: false,
        message: `Failed to swap and send tokens: ${error.message || 'Unknown error'}`
      };
    }
  },

  /**
   * Get token balances for the user
   * @param agent The AgentRuntime instance
   * @param tokenTypes Array of token types to check balances for
   * @returns Object containing token balances
   */
  getTokenBalances: async (agent: AgentRuntime, tokenTypes: string[] = ["0x1::aptos_coin::AptosCoin"]) => {
    try {
      const balances: Record<string, any> = {};
      
      for (const tokenType of tokenTypes) {
        const balance = await agent.getBalance(tokenType);
        balances[tokenType] = balance;
      }
      
      return {
        success: true,
        balances,
        message: "Successfully retrieved token balances"
      };
    } catch (error: any) {
      console.error("Error getting token balances:", error);
      return {
        success: false,
        message: `Failed to get token balances: ${error.message || 'Unknown error'}`
      };
    }
  }
};

export default tokenOperations; 