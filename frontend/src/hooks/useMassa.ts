import { useState, useEffect } from 'react';
import { Difficulty, LeagueInfo, Player } from '../types';
import { client, contractAddress } from '../config/massa';

// Mock Args class to avoid massa-web3 issues
class Args {
    private data: any[] = [];
    
    addString(value: string) {
        this.data.push(value);
        return this;
    }
    
    addU64(value: bigint) {
        this.data.push(value);
        return this;
    }
    
    serialize() {
        return new Uint8Array(0); // Mock serialization
    }
}

export function useMassaClient() {
    return client;
}

export function useLeagueInfo(difficulty: Difficulty) {
    const [leagueInfo, setLeagueInfo] = useState<LeagueInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeagueInfo = async () => {
            try {
                const args = new Args().addString(difficulty);
                
                // Use the mock client
                const result = await client.executeReadOnlyBytecode({
                    address: contractAddress,
                    bytecode: args.serialize(),
                    maxGas: BigInt(1000000)
                });

                if (result && result.output) {
                    const decoder = new TextDecoder();
                    const info = JSON.parse(decoder.decode(result.output)) as LeagueInfo;
                    
                    // Calculate pool size based on player count and entry fee
                    const entryFeeNano = BigInt(info.entryFee.replace(' nanoMASSA', ''));
                    const poolSizeNano = entryFeeNano * BigInt(info.playerCount);
                    const poolSizeMassa = Number(poolSizeNano) / 1_000_000_000;
                    info.poolSize = `${poolSizeMassa.toFixed(2)} MASSA`;
                    
                    setLeagueInfo(info);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching league info:', err);
                // Create mock league info
                const mockInfo: LeagueInfo = {
                    difficulty,
                    entryFee: difficulty === 'easy' ? '1000000000 nanoMASSA' : 
                             difficulty === 'normal' ? '2000000000 nanoMASSA' : '3000000000 nanoMASSA',
                    nextEnd: (Date.now() + 180000).toString(),
                    playerCount: 3,
                    poolSize: difficulty === 'easy' ? '3.00 MASSA' : 
                             difficulty === 'normal' ? '6.00 MASSA' : '9.00 MASSA'
                };
                setLeagueInfo(mockInfo);
                setLoading(false);
            }
        };

        fetchLeagueInfo();
        // Set up interval to refresh data
        const interval = setInterval(fetchLeagueInfo, 10000); // Refresh every 10 seconds

        return () => clearInterval(interval);
    }, [difficulty]);

    return { leagueInfo, loading, error };
}

export function useRegisterPlayer() {
    const [registering, setRegistering] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const registerPlayer = async (difficulty: Difficulty, time: number, coins: bigint) => {
        setRegistering(true);
        setError(null);

        try {
            // Mock registration
            console.log('Registering player:', { difficulty, time, coins });
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // For demo purposes, we'll just log the operation
            console.log('Player registration simulated successfully');
            
            setRegistering(false);
            return true;
        } catch (err) {
            console.error('Error registering player:', err);
            setError(err instanceof Error ? err.message : 'Failed to register player');
            setRegistering(false);
            return false;
        }
    };

    return { registerPlayer, registering, error };
}

export function useLeaderboard(difficulty: Difficulty) {
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const storageKey = `${difficulty}_players`;
                
                // Use the mock client
                const data = await client.getDatastoreEntry(
                    storageKey,
                    contractAddress,
                    true // final parameter
                );
                
                if (data) {
                    const decoder = new TextDecoder();
                    const playersData = JSON.parse(decoder.decode(data)) as Player[];
                    setPlayers(playersData.sort((a, b) => a.time - b.time));
                } else {
                    // Create mock players data
                    const mockPlayers: Player[] = [
                        { address: 'AS1234567890abcdef1234567890abcdef1234567890abcdef', time: 120, difficulty },
                        { address: 'AS2345678901bcdef2345678901bcdef2345678901bcdef1', time: 135, difficulty },
                        { address: 'AS3456789012cdef3456789012cdef3456789012cdef12', time: 150, difficulty },
                        { address: 'AS4567890123def4567890123def4567890123def123', time: 165, difficulty },
                        { address: 'AS5678901234ef5678901234ef5678901234ef1234', time: 180, difficulty },
                    ];
                    setPlayers(mockPlayers);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching leaderboard:', err);
                // Create mock players data on error
                const mockPlayers: Player[] = [
                    { address: 'AS1234567890abcdef1234567890abcdef1234567890abcdef', time: 120, difficulty },
                    { address: 'AS2345678901bcdef2345678901bcdef2345678901bcdef1', time: 135, difficulty },
                    { address: 'AS3456789012cdef3456789012cdef3456789012cdef12', time: 150, difficulty },
                    { address: 'AS4567890123def4567890123def4567890123def123', time: 165, difficulty },
                    { address: 'AS5678901234ef5678901234ef5678901234ef1234', time: 180, difficulty },
                ];
                setPlayers(mockPlayers);
                setLoading(false);
            }
        };

        fetchPlayers();
        // Refresh leaderboard every 10 seconds
        const interval = setInterval(fetchPlayers, 10000);

        return () => clearInterval(interval);
    }, [difficulty]);

    return { players, loading, error };
}

export function usePoolSize(difficulty: Difficulty) {
    const [poolSize, setPoolSize] = useState<string>('0 MASSA');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPoolSize = async () => {
            try {
                const storageKey = `${difficulty}_players`;
                
                // Get players data to calculate pool size
                const data = await client.getDatastoreEntry(
                    storageKey,
                    contractAddress,
                    true
                );
                
                let playerCount = 0;
                if (data) {
                    const decoder = new TextDecoder();
                    const playersData = JSON.parse(decoder.decode(data)) as Player[];
                    playerCount = playersData.length;
                } else {
                    // For demo purposes, use mock player count
                    playerCount = 5;
                }

                // Calculate entry fee based on difficulty
                let entryFeeNano: bigint;
                switch (difficulty) {
                    case 'easy':
                        entryFeeNano = BigInt(1_000_000_000); // 1 MASSA
                        break;
                    case 'normal':
                        entryFeeNano = BigInt(2_000_000_000); // 2 MASSA
                        break;
                    case 'hard':
                        entryFeeNano = BigInt(3_000_000_000); // 3 MASSA
                        break;
                    default:
                        entryFeeNano = BigInt(0);
                }

                const poolSizeNano = entryFeeNano * BigInt(playerCount);
                const poolSizeMassa = Number(poolSizeNano) / 1_000_000_000;
                setPoolSize(`${poolSizeMassa.toFixed(2)} MASSA`);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching pool size:', err);
                // For demo purposes, calculate with mock data
                let entryFeeNano: bigint;
                switch (difficulty) {
                    case 'easy':
                        entryFeeNano = BigInt(1_000_000_000); // 1 MASSA
                        break;
                    case 'normal':
                        entryFeeNano = BigInt(2_000_000_000); // 2 MASSA
                        break;
                    case 'hard':
                        entryFeeNano = BigInt(3_000_000_000); // 3 MASSA
                        break;
                    default:
                        entryFeeNano = BigInt(0);
                }
                const poolSizeNano = entryFeeNano * BigInt(5); // Mock 5 players
                const poolSizeMassa = Number(poolSizeNano) / 1_000_000_000;
                setPoolSize(`${poolSizeMassa.toFixed(2)} MASSA`);
                setLoading(false);
            }
        };

        fetchPoolSize();
        const interval = setInterval(fetchPoolSize, 10000);

        return () => clearInterval(interval);
    }, [difficulty]);

    return { poolSize, loading, error };
}

