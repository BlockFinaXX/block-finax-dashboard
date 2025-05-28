import { useCallback, useEffect, useState, useRef } from "react";
import { Network, Alchemy } from "alchemy-sdk";
import { useSession } from "next-auth/react";
import { parseEther, formatEther } from "viem";

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!;

interface SmartAccountWithAddress {
  accountAddress: string;
  sendTransaction: (params: { to: string; value: bigint }) => Promise<any>;
  provider: {
    getBalance: (address: string) => Promise<bigint>;
  };
}

// Polling interval in milliseconds (2 minutes)
const BALANCE_POLL_INTERVAL = 120000;

export function useSmartWallet() {
  const { data: session } = useSession();
  const [smartAccount, setSmartAccount] =
    useState<SmartAccountWithAddress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState<string>("0");
  const pollingIntervalRef = useRef<NodeJS.Timeout>();
  const walletAddressRef = useRef<string | null>(null);
  const lastFetchTimeRef = useRef<number>(0);
  const isFetchingRef = useRef<boolean>(false);
  const mountedRef = useRef<boolean>(true);

  // Separate function for balance fetching
  const fetchBalance = useCallback(async (address: string) => {
    if (!mountedRef.current || isFetchingRef.current) return;

    const now = Date.now();
    if (now - lastFetchTimeRef.current < 30000) return;

    try {
      isFetchingRef.current = true;
      const response = await fetch(`/api/wallet/balance?address=${address}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch balance");
      }

      const data = await response.json();
      if (!data.balance) {
        throw new Error("Invalid balance response");
      }

      const balance = BigInt(data.balance);
      if (mountedRef.current) {
        setBalance(formatEther(balance));
      }
      lastFetchTimeRef.current = now;
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  // Separate function for polling control
  const startPolling = useCallback(
    (address: string) => {
      if (!mountedRef.current) return;
      stopPolling();

      pollingIntervalRef.current = setInterval(() => {
        if (mountedRef.current) {
          fetchBalance(address);
        }
      }, BALANCE_POLL_INTERVAL);
    },
    [fetchBalance]
  );

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = undefined;
    }
  }, []);

  // Initialize wallet only once when session changes
  useEffect(() => {
    mountedRef.current = true;
    let isInitialized = false;

    const initializeWallet = async () => {
      if (!session?.user?.email || !mountedRef.current || isInitialized) return;

      try {
        const walletAddress = session.user.walletAddress;
        if (!walletAddress || !ALCHEMY_API_KEY) return;

        walletAddressRef.current = walletAddress;
        isInitialized = true;

        const alchemy = new Alchemy({
          apiKey: ALCHEMY_API_KEY,
          network: Network.BASE_SEPOLIA,
          maxRetries: 3,
        });

        const smartAccountClient: SmartAccountWithAddress = {
          accountAddress: walletAddress,
          sendTransaction: async (params) => ({
            hash: "0x...",
            wait: async () => ({
              hash: "0x...",
              status: 1,
            }),
          }),
          provider: {
            getBalance: async (address) => {
              try {
                const response = await fetch(
                  `/api/wallet/balance?address=${address}`
                );
                if (!response.ok) throw new Error("Failed to fetch balance");
                const data = await response.json();
                return BigInt(data.balance);
              } catch (error) {
                console.error("Error fetching balance:", error);
                return BigInt(0);
              }
            },
          },
        };

        if (mountedRef.current) {
          setSmartAccount(smartAccountClient);
          await fetchBalance(walletAddress);
        }
      } catch (error) {
        console.error("Failed to initialize smart wallet:", error);
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    initializeWallet();

    return () => {
      mountedRef.current = false;
      stopPolling();
    };
  }, [
    session?.user?.email,
    session?.user?.walletAddress,
    fetchBalance,
    stopPolling,
  ]);

  // Separate effect for polling
  useEffect(() => {
    if (walletAddressRef.current && mountedRef.current) {
      startPolling(walletAddressRef.current);
    }
    return stopPolling;
  }, [startPolling, stopPolling]);

  const sendTransaction = async (to: string, amount: string) => {
    if (!smartAccount) throw new Error("Smart account not initialized");

    try {
      const tx = await smartAccount.sendTransaction({
        to,
        value: parseEther(amount),
      });

      const receipt = await tx.wait();

      if (walletAddressRef.current) {
        await fetchBalance(walletAddressRef.current);
      }

      return receipt;
    } catch (error) {
      console.error("Failed to send transaction:", error);
      throw error;
    }
  };

  const getBalance = async () => {
    if (!smartAccount || !walletAddressRef.current) return "0";
    try {
      await fetchBalance(walletAddressRef.current);
      return balance;
    } catch (error) {
      console.error("Error getting balance:", error);
      return balance;
    }
  };

  return {
    smartAccount,
    isLoading,
    balance,
    sendTransaction,
    getBalance,
  };
}
