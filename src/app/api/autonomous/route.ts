import { NextRequest, NextResponse } from 'next/server';
import { AgentRuntime, LocalSigner, createAptosTools } from 'move-agent-kit';
import { AptosConfig, Network, Aptos, Ed25519PrivateKey, PrivateKey, PrivateKeyVariants } from '@aptos-labs/ts-sdk';
import { createAutonomousManager, UserPreferences } from '@/utils/autonomousOperations';

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
    
    return { agent };
  } catch (error) {
    console.error('Error initializing agent runtime:', error);
    throw error;
  }
};

export async function POST(req: NextRequest) {
  try {
    const { operation, privateKey, walletAddress, preferences, strategy } = await req.json();

    if (!privateKey) {
      return NextResponse.json({ error: 'Private key is required' }, { status: 400 });
    }

    if (!operation) {
      return NextResponse.json({ error: 'Operation type is required' }, { status: 400 });
    }

    // Initialize the agent runtime
    const { agent } = await initializeAgentRuntime(privateKey);
    
    // Create autonomous manager
    const autonomousManager = createAutonomousManager(agent);
    
    // Set user preferences if provided
    if (preferences) {
      autonomousManager.setUserPreferences(preferences as UserPreferences);
    }

    // Execute the requested operation
    let result;
    switch (operation) {
      case 'analyzePortfolio':
        if (!walletAddress) {
          return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
        }
        result = await autonomousManager.analyzePortfolio(walletAddress);
        break;
        
      case 'findYieldOpportunities':
        result = await autonomousManager.findBestYieldOpportunities();
        break;
        
      case 'executeTradingStrategy':
        if (!strategy) {
          return NextResponse.json({ error: 'Trading strategy is required' }, { status: 400 });
        }
        result = await autonomousManager.executeTradingStrategy(strategy);
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid operation type' }, { status: 400 });
    }

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Error processing autonomous operation:', error);
    return NextResponse.json(
      { error: `Error processing operation: ${error.message}` },
      { status: 500 }
    );
  }
} 