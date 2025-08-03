import { useState, useEffect } from 'react';
import { 
    JsonRPCClient, 
    Args, 
    ReadOnlyCallResult,
    Provider,
    Account,
    BaseSmartContractOperation,
    ReadOnlyParams,
    SendOperationInput,
    DatastoreEntry
} from '@massalabs/massa-web3';
import { Difficulty, LeagueInfo, Player } from '../types';
import { Buffer } from 'buffer';
import { client, contractAddress, wallet } from '../config/massa';
import { TextDecoder } from 'util';

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
                const bytecodeExecution = {
                    address: contractAddress,
                    bytecode: args.serialize(),
                    maxGas: BigInt(1000000)
                };
                const result = await client.executeReadOnlyBytecode(bytecodeExecution);

                if (result && result.output) {
                    const decoder = new TextDecoder();
                    const info = JSON.parse(decoder.decode(result.output)) as LeagueInfo;
                    setLeagueInfo(info);
                }
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch league info');
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
            const args = new Args()
                .addU64(BigInt(time))
                .addString(difficulty);

            const operationInput: SendOperationInput = {
                data: args.serialize(),
                maxGas: BigInt(1000000),
                publicKey: '', // This should come from your wallet configuration
                signature: '', // This should be generated from your wallet
                nonce: BigInt(0)  // This should be obtained from the current account state
            };

            await client.sendOperation(operationInput);
            setRegistering(false);
            return true;
        } catch (err) {
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
                const entry: DatastoreEntry = {
                    address: contractAddress,
                    key: Buffer.from(storageKey)
                };
                const data = await client.getDatastoreEntries([entry]);
                
                if (data && data[0]) {
                    const decoder = new TextDecoder();
                    const playersData = JSON.parse(decoder.decode(data[0])) as Player[];
                    setPlayers(playersData.sort((a, b) => a.time - b.time));
                }
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
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
