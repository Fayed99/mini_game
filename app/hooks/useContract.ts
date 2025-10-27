import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract';
import { Address } from 'viem';

export interface LeaderboardEntry {
  player: Address;
  score: bigint;
  timestamp: bigint;
}

/**
 * Hook to get player's remaining energy
 */
export function useRemainingEnergy(address: Address | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS as Address,
    abi: CONTRACT_ABI,
    functionName: 'getRemainingEnergy',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!CONTRACT_ADDRESS,
    }
  });
}

/**
 * Hook to get player stats
 */
export function usePlayerStats(address: Address | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS as Address,
    abi: CONTRACT_ABI,
    functionName: 'getPlayerStats',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!CONTRACT_ADDRESS,
    }
  });
}

/**
 * Hook to get top players from leaderboard
 */
export function useTopPlayers(count: number = 10) {
  return useReadContract({
    address: CONTRACT_ADDRESS as Address,
    abi: CONTRACT_ABI,
    functionName: 'getTopPlayers',
    args: [BigInt(count)],
    query: {
      enabled: !!CONTRACT_ADDRESS,
    }
  });
}

/**
 * Hook to get player's rank
 */
export function usePlayerRank(address: Address | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS as Address,
    abi: CONTRACT_ABI,
    functionName: 'getPlayerRank',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!CONTRACT_ADDRESS,
    }
  });
}

/**
 * Hook to submit score to the contract
 */
export function useSubmitScore() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const submitScore = (score: number) => {
    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address not set');
    }
    
    writeContract({
      address: CONTRACT_ADDRESS as Address,
      abi: CONTRACT_ABI,
      functionName: 'submitScore',
      args: [BigInt(score)],
    });
  };

  return {
    submitScore,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}
