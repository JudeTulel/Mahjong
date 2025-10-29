import { useState, useEffect, useCallback } from 'react';
import { web3 } from '@hicaru/bearby.js';

interface BearbyWalletState {
  connected: boolean;
  enabled: boolean;
  installed: boolean;
  address: string | null;
  network: string | null;
  loading: boolean;
  error: string | null;
}

interface BearbyWalletActions {
  connect: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  signTransaction: (transaction: any) => Promise<string>;
  signMessage: (message: string) => Promise<any>;
  clearError: () => void;
}

export const useBearbyWallet = (): BearbyWalletState & BearbyWalletActions => {
  const [state, setState] = useState<BearbyWalletState>({
    connected: false,
    enabled: false,
    installed: false,
    address: null,
    network: null,
    loading: false,
    error: null,
  });

  // Check wallet installation and status on mount
  useEffect(() => {
    const checkWalletStatus = () => {
      try {
        const installed = web3?.wallet?.installed || false;
        const connected = web3?.wallet?.connected || false;
        const enabled = web3?.wallet?.enabled || false;
        const address = connected ? web3?.wallet?.account?.base58 || null : null;

        setState(prev => ({
          ...prev,
          installed,
          connected,
          enabled,
          address,
        }));
      } catch (error) {
        console.warn('Bearby wallet not available:', error);
        setState(prev => ({
          ...prev,
          installed: false,
          connected: false,
          enabled: false,
          address: null,
        }));
      }
    };

    // Initial check
    checkWalletStatus();

    // Set up event listeners for wallet state changes
    let accountObserver: any = null;
    let networkObserver: any = null;

    try {
      // Subscribe to account changes
      if (web3?.wallet?.account?.subscribe) {
        accountObserver = web3.wallet.account.subscribe((base58: string, accounts: any) => {
          setState(prev => ({
            ...prev,
            address: base58,
            connected: !!base58,
          }));
        });
      }

      // Subscribe to network changes
      if (web3?.wallet?.network?.subscribe) {
        networkObserver = web3.wallet.network.subscribe((networkName: string) => {
          setState(prev => ({
            ...prev,
            network: networkName,
          }));
        });
      }
    } catch (error) {
      console.warn('Failed to set up wallet subscriptions:', error);
    }

    // Cleanup function
    return () => {
      try {
        if (accountObserver?.unsubscribe) {
          accountObserver.unsubscribe();
        }
        if (networkObserver?.unsubscribe) {
          networkObserver.unsubscribe();
        }
      } catch (error) {
        console.warn('Error during cleanup:', error);
      }
    };
  }, []);

  const connect = useCallback(async (): Promise<boolean> => {
    if (!web3?.wallet) {
      setState(prev => ({
        ...prev,
        error: 'Bearby wallet not installed. Please install the Bearby browser extension.',
      }));
      return false;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const connected = await web3.wallet.connect();
      
      if (connected) {
        const address = web3.wallet.account?.base58 || null;
        const network = web3.wallet.network || null;
        
        setState(prev => ({
          ...prev,
          connected: true,
          address,
          network,
          loading: false,
        }));
        
        console.log('Successfully connected to Bearby wallet');
        return true;
      } else {
        setState(prev => ({
          ...prev,
          error: 'Connection rejected by user',
          loading: false,
        }));
        return false;
      }
    } catch (error: any) {
      console.error('Failed to connect to Bearby wallet:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to connect to wallet',
        loading: false,
      }));
      return false;
    }
  }, []);

  const disconnect = useCallback(async (): Promise<boolean> => {
    if (!web3?.wallet) {
      return false;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const disconnected = await web3.wallet.disconnect();
      
      if (disconnected) {
        setState(prev => ({
          ...prev,
          connected: false,
          address: null,
          loading: false,
        }));
        
        console.log('Successfully disconnected from Bearby wallet');
        return true;
      } else {
        setState(prev => ({
          ...prev,
          error: 'Failed to disconnect',
          loading: false,
        }));
        return false;
      }
    } catch (error: any) {
      console.error('Failed to disconnect from Bearby wallet:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to disconnect from wallet',
        loading: false,
      }));
      return false;
    }
  }, []);

  const signTransaction = useCallback(async (transaction: any): Promise<string> => {
    if (!web3?.wallet || !state.connected) {
      throw new Error('Wallet not connected');
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const txHash = await web3.wallet.signTransaction(transaction);
      setState(prev => ({ ...prev, loading: false }));
      return txHash;
    } catch (error: any) {
      console.error('Failed to sign transaction:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to sign transaction',
        loading: false,
      }));
      throw error;
    }
  }, [state.connected]);

  const signMessage = useCallback(async (message: string): Promise<any> => {
    if (!web3?.wallet || !state.connected) {
      throw new Error('Wallet not connected');
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const signedMessage = await web3.wallet.signMessage(message);
      setState(prev => ({ ...prev, loading: false }));
      return signedMessage;
    } catch (error: any) {
      console.error('Failed to sign message:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to sign message',
        loading: false,
      }));
      throw error;
    }
  }, [state.connected]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    signTransaction,
    signMessage,
    clearError,
  };
};

export default useBearbyWallet;