import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { HumanMessage } from '@langchain/core/messages';
import { MemorySaver } from '@langchain/langgraph';
import { AgentRuntime, LocalSigner, createAptosTools } from 'move-agent-kit';
import { AptosConfig, Network, Aptos, Ed25519PrivateKey, PrivateKey, PrivateKeyVariants } from '@aptos-labs/ts-sdk';
import { v4 as uuidv4 } from 'uuid';

// Initialize the LLM
const llm = new ChatGoogleGenerativeAI({
	modelName: 'gemini-2.0-flash',
	apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
	temperature: 0.7,
});

// Initialize Aptos configuration
const initializeAgentRuntime = async (privateKey: string) => {
	try {
		const aptosConfig = new AptosConfig({
			network: Network.TESTNET,
		});

		const aptos = new Aptos(aptosConfig);

		// Format the private key to be AIP-80 compliant
		const formattedPrivateKey = PrivateKey.formatPrivateKey(privateKey, 'ed25519' as PrivateKeyVariants);

		// Create a private key instance from the formatted hex string
		const privateKeyInstance = new Ed25519PrivateKey(formattedPrivateKey);

		const account = await aptos.deriveAccountFromPrivateKey({
			privateKey: privateKeyInstance,
		});

		const signer = new LocalSigner(account, Network.TESTNET);
		const agent = new AgentRuntime(signer, aptos, {});
		
		// Create tools with all available tools (no filter)
		const tools = createAptosTools(agent);

		return { agent, tools };
	} catch (error) {
		console.error('Error initializing agent runtime:', error);
		throw error;
	}
};

export async function POST(req: NextRequest) {
	try {
		const { message, walletAddress, privateKey } = await req.json();

		if (!message) {
			return NextResponse.json({ error: 'Message is required' }, { status: 400 });
		}

		if (!privateKey) {
			return NextResponse.json({ error: 'Private key is required' }, { status: 400 });
		}

		// Initialize the agent runtime with tools
		const { tools } = await initializeAgentRuntime(privateKey);

		// Create memory saver for the agent with a thread_id
		const memory = new MemorySaver();
		
		// Generate a unique thread ID for this conversation
		const threadId = uuidv4();

		// Create the agent
		const moneyBuddyAgent = createReactAgent({
			llm,
			tools,
			checkpointSaver: memory,
			messageModifier: `
        You are Money Buddy, a helpful AI assistant for DeFi operations on the Aptos blockchain.
        You can help users with a wide range of operations including:
        - Token transfers and balance checks
        - Token swaps through various protocols (LiquidSwap, Panora, etc.)
        - Staking operations with Amnis, Echo, and Thala
        - Lending and borrowing through Joule, Aries, and Echelon
        - Liquidity provision and pool management
        - Token creation, minting, and burning
        - NFT operations
        - And many other DeFi operations

        You have access to ALL available tools in the Move Agent Kit for interacting with the Aptos blockchain.
        Always be helpful, concise, and security-conscious.
        If you're asked to perform an operation that requires funds, check if the user has sufficient balance first.
        If there's an error, explain it clearly and suggest possible solutions.
        The user's wallet address is: ${walletAddress}
      `,
		});

		// Process the message with the thread_id in the config
		const response = await moneyBuddyAgent.invoke(
			{
				messages: [new HumanMessage(message)],
			},
			{
				configurable: {
					thread_id: threadId,
				},
			}
		);

		// Extract the response content
		const responseContent = response.messages[response.messages.length - 1].content;

		return NextResponse.json({ response: responseContent });
	} catch (error: any) {
		console.error('Error processing request:', error);
		return NextResponse.json(
			{ error: `Error processing request: ${error.message}` },
			{ status: 500 }
		);
	}
} 