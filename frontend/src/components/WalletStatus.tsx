import React from 'react';
import { useBearbyWallet } from '../hooks/useBearbyWallet';

interface WalletStatusProps {
  className?: string;
}

export const WalletStatus: React.FC<WalletStatusProps> = ({ className = '' }) => {
  const { 
    connected, 
    enabled, 
    installed, 
    address, 
    network, 
    loading, 
    error, 
    connect, 
    disconnect, 
    clearError 
  } = useBearbyWallet();

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!installed) {
    return (
      <div className={`wallet-status not-installed ${className}`}>
        <div className="wallet-info">
          <span className="wallet-icon">⚠️</span>
          <span className="wallet-text">Bearby Wallet Not Installed</span>
        </div>
        <a 
          href="https://bearby.io" 
          target="_blank" 
          rel="noopener noreferrer"
          className="install-button"
        >
          Install Bearby
        </a>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`wallet-status error ${className}`}>
        <div className="wallet-info">
          <span className="wallet-icon">❌</span>
          <span className="wallet-text">Error: {error}</span>
        </div>
        <button onClick={clearError} className="clear-error-button">
          Clear
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`wallet-status loading ${className}`}>
        <div className="wallet-info">
          <span className="wallet-icon spinning">⚡</span>
          <span className="wallet-text">Connecting...</span>
        </div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className={`wallet-status disconnected ${className}`}>
        <div className="wallet-info">
          <span className="wallet-icon">🔗</span>
          <span className="wallet-text">Wallet Not Connected</span>
        </div>
        <button onClick={connect} className="connect-button">
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className={`wallet-status connected ${className}`}>
      <div className="wallet-info">
        <span className="wallet-icon">✅</span>
        <div className="wallet-details">
          <span className="wallet-address">{formatAddress(address || '')}</span>
          {network && <span className="wallet-network">{network}</span>}
        </div>
      </div>
      <button onClick={disconnect} className="disconnect-button">
        Disconnect
      </button>
    </div>
  );
};

export default WalletStatus;