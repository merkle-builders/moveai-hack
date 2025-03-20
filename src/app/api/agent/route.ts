import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { AgentRuntime, LocalSigner, createAptosTools } from "move-agent-kit";
import { AptosConfig, Network, Aptos, Ed25519PrivateKey, PrivateKey, PrivateKeyVariants } from "@aptos-labs/ts-sdk";
import { v4 as uuidv4 } from "uuid";

// Initialize the LLM
const llm = new ChatGoogleGenerativeAI({
  modelName: "gemini-2.0-flash",
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
    const formattedPrivateKey = PrivateKey.formatPrivateKey(privateKey, "ed25519" as PrivateKeyVariants);

    // Create a private key instance from the formatted hex string
    const privateKeyInstance = new Ed25519PrivateKey(formattedPrivateKey);

    const account = await aptos.deriveAccountFromPrivateKey({
      privateKey: privateKeyInstance,
    });

    const signer = new LocalSigner(account, Network.TESTNET);
    const agent = new AgentRuntime(signer, aptos, {
      twitter: {
        //optional
        username: process.env.TWITTER_USERNAME,
        password: process.env.TWITTER_PASSWORD,
      },
    });

    // Create tools with all available tools (no filter)
    const tools = createAptosTools(agent);

    return { agent, tools };
  } catch (error) {
    console.error("Error initializing agent runtime:", error);
    throw error;
  }
};

export async function POST(req: NextRequest) {
  try {
    const { message, walletAddress, privateKey } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!privateKey) {
      return NextResponse.json({ error: "Private key is required" }, { status: 400 });
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
        You are Money Buddy, a specialized AI assistant focused on Emojicoin creation and social media promotion on the Aptos blockchain.

        Your core capabilities include:
        - Creating and launching new Emojicoins with custom emoji combinations
        - Managing Emojicoin markets and viewing market data
        - Providing liquidity to Emojicoin markets
        - Setting up automated Twitter promotion for Emojicoins
        - Creating engaging social media content

        For Emojicoin operations:
        - Help users launch unique Emojicoin markets
        - Monitor market performance and metrics
        - Assist with liquidity provision

        For Twitter integration:
        - Create and post promotional tweets
        - Set up automated promotion strategies
        - Ensure proper social media engagement

        Important guidelines:
        - When a user launches an Emojicoin, I'll offer to set up AI-powered Twitter promotion
        - For Twitter operations, I'll verify proper authentication
        - I'll check for sufficient funds before any financial operations
        - I'll provide clear explanations and solutions for any errors

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
      },
    );

    // Extract the response content
    const responseContent = response.messages[response.messages.length - 1].content;

    return NextResponse.json({ response: responseContent });
  } catch (error: any) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: `Error processing request: ${error.message}` }, { status: 500 });
  }
}
