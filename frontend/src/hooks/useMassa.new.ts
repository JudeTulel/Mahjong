import { 
    JsonRPCClient, 
    Args, 
    ReadOnlyCallResult,
    Account,
    SendOperationInput,
    OperationType} from '@massalabs/massa-web3';
import { Difficulty, LeagueInfo, Player } from '../types';
import { client, contractAddress } from '../config/massa';
import { Buffer } from 'buffer';
import { useState, useEffect } from 'react';

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
                const result = await client.executeReadOnlyBytecode({
                    address: contractAddress,
                    data: args.serialize(),
                    maxGas: BigInt(1000000)
                });

                if (result && result.executionOutput) {
                    const output = result.executionOutput;
                    const info = JSON.parse(Buffer.from(output).toString()) as LeagueInfo;
                    setLeagueInfo(info);
                }
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch league info');
                setLoading(false);
            }
        };

        fetchLeagueInfo();
        const interval = setInterval(fetchLeagueInfo, 10000);

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

            const operation: SendOperationInput = {
                type: OperationType.Transaction,
                fee: BigInt(0),
                maxGas: BigInt(1000000),
                coins: coins,
                target: contractAddress,
                data: args.serialize()
            };

            await client.sendOperation(operation);
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
                const data = await client.getDatastoreEntries([{
                    address: contractAddress,
                    key: Buffer.from(storageKey)
                }]);
                
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
        const interval = setInterval(fetchPlayers, 10000);

        return () => clearInterval(interval);
    }, [difficulty]);

    return { players, loading, error };
}
