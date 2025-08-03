import { JsonRPCClient } from '@massalabs/massa-web3';

declare global {
    interface ImportMetaEnv {
        VITE_MASSA_RPC_URL: string;
        VITE_CONTRACT_ADDRESS: string;
        VITE_PRIVATE_KEY: string;
    }
    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }
}

const RPC_URL = import.meta.env.VITE_MASSA_RPC_URL;
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY;

// Initialize JsonRPCClient
export const client = new JsonRPCClient(RPC_URL);
export const contractAddress = CONTRACT_ADDRESS;
export const privateKey = PRIVATE_KEY;
