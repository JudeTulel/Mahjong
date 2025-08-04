// Simple massa configuration that works with Next.js SSR

// Default values for local buildnet
const DEFAULT_RPC_URL = 'http://127.0.0.1:33035';
const DEFAULT_CONTRACT_ADDRESS = '';
const DEFAULT_PRIVATE_KEY = '';
const DEFAULT_NETWORK = 'buildnet';
const DEFAULT_CHAIN_ID = '77658366';

// Safe environment variable access that works in both client and server
function getEnvVar(key: string, defaultValue: string): string {
    if (typeof window !== 'undefined') {
        // Client-side
        return (window as any).__ENV__?.[key] || defaultValue;
    } else {
        // Server-side - use defaults to avoid SSR issues
        return defaultValue;
    }
}

// Get environment variables with fallbacks
const RPC_URL = getEnvVar('VITE_MASSA_RPC_URL', DEFAULT_RPC_URL);
const CONTRACT_ADDRESS = getEnvVar('VITE_CONTRACT_ADDRESS', DEFAULT_CONTRACT_ADDRESS);
const PRIVATE_KEY = getEnvVar('VITE_PRIVATE_KEY', DEFAULT_PRIVATE_KEY);
const NETWORK = getEnvVar('VITE_NETWORK', DEFAULT_NETWORK);
const CHAIN_ID = getEnvVar('VITE_CHAIN_ID', DEFAULT_CHAIN_ID);

// Create a simple client placeholder that works with local buildnet
export const client = {
    executeReadOnlyBytecode: async (params: any) => {
        console.log('Mock executeReadOnlyBytecode called with:', params);
        
        // Mock response based on the function being called
        const mockResponse = {
            difficulty: params.address ? 'easy' : 'easy',
            entryFee: '1000000000 nanoMASSA',
            nextEnd: (Date.now() + 180000).toString(),
            playerCount: '5'
        };
        
        return { 
            output: new TextEncoder().encode(JSON.stringify(mockResponse))
        };
    },
    
    getDatastoreEntry: async (key: string, address: string, final: boolean) => {
        console.log('Mock getDatastoreEntry called with:', { key, address, final });
        // Return null to trigger mock data in hooks
        return null;
    },
    
    sendOperation: async (operation: any) => {
        console.log('Mock sendOperation called with:', operation);
        // Simulate successful operation
        await new Promise(resolve => setTimeout(resolve, 1000));
        return 'mock_operation_id_' + Date.now();
    }
};

// Export configuration
export const contractAddress = CONTRACT_ADDRESS;
export const privateKey = PRIVATE_KEY;
export const network = NETWORK;
export const chainId = CHAIN_ID;
export const rpcUrl = RPC_URL;

// Export client configuration for debugging
export const clientConfig = {
    url: RPC_URL,
    contractAddress: CONTRACT_ADDRESS,
    network: NETWORK,
    chainId: CHAIN_ID
};

// Only log on client side to avoid SSR issues
if (typeof window !== 'undefined') {
    console.log('Massa client initialized with:', {
        rpcUrl: RPC_URL,
        network: NETWORK,
        chainId: CHAIN_ID,
        hasContractAddress: !!CONTRACT_ADDRESS,
        hasPrivateKey: !!PRIVATE_KEY
    });
}

