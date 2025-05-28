import { useCallback, useEffect, useState } from "react";
import { Network, Alchemy } from "alchemy-sdk";
import { useSession } from "next-auth/react";
import { parseEther, formatEther } from "viem";

const ENTRY_POINT = process.env.ENTRY_POINT_ADDRESS!;
const FACTORY_ADDRESS = process.env.FACTORY_ADDRESS!;
const PAYMASTER_ADDRESS = process.env.PAYMASTER_ADDRESS!;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY!;

interface SmartAccountWithAddress {
  accountAddress: string;
  sendTransaction: (params: { to: string; value: bigint }) => Promise<any>;
  provider: {
    getBalance: (address: string) => Promise<bigint>;
  };
}

export function useSmartWallet() {
  const { data: session } = useSession();
  const [smartAccount, setSmartAccount] =
    useState<SmartAccountWithAddress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState<string>("0");

  const initializeSmartWallet = useCallback(async () => {
    if (!session?.user?.email) return;

    try {
      // Get the smart account address from the session
      const walletAddress = session.user.walletAddress;

      if (!walletAddress) {
        throw new Error("No smart account address found");
      }

      // Initialize Alchemy SDK
      const alchemy = new Alchemy({
        apiKey: ALCHEMY_API_KEY,
        network: Network.BASE_SEPOLIA,
      });

      // Create a wrapper that matches our interface
      const smartAccountClient: SmartAccountWithAddress = {
        accountAddress: walletAddress,
        sendTransaction: async (params) => {
          // For now, we'll just return a mock transaction
          // TODO: Implement actual transaction sending
          return {
            hash: "0x...",
            wait: async () => ({
              hash: "0x...",
              status: 1,
            }),
          };
        },
        provider: {
          getBalance: async (address) => {
            try {
              const balance = await alchemy.core.getBalance(address);
              console.log("Raw balance:", balance.toString());
              return BigInt(balance.toString());
            } catch (error) {
              console.error("Error fetching balance:", error);
              return BigInt(0);
            }
          },
        },
      };

      setSmartAccount(smartAccountClient);

      // Get initial balance
      const balance = await smartAccountClient.provider.getBalance(
        walletAddress
      );
      console.log("Initial balance:", balance.toString());
      setBalance(formatEther(balance));
    } catch (error) {
      console.error("Failed to initialize smart wallet:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.email, session?.user?.walletAddress]);

  useEffect(() => {
    initializeSmartWallet();
  }, [initializeSmartWallet]);

  const sendTransaction = async (to: string, amount: string) => {
    if (!smartAccount) throw new Error("Smart account not initialized");

    try {
      const tx = await smartAccount.sendTransaction({
        to,
        value: parseEther(amount),
      });

      // Wait for transaction to be mined
      const receipt = await tx.wait();

      // Update balance after transaction
      const newBalance = await smartAccount.provider.getBalance(
        smartAccount.accountAddress
      );
      setBalance(formatEther(newBalance));

      return receipt;
    } catch (error) {
      console.error("Failed to send transaction:", error);
      throw error;
    }
  };

  const getBalance = async () => {
    if (!smartAccount) return "0";

    try {
      const balance = await smartAccount.provider.getBalance(
        smartAccount.accountAddress
      );
      const formattedBalance = formatEther(balance);
      setBalance(formattedBalance);
      return formattedBalance;
    } catch (error) {
      console.error("Failed to get balance:", error);
      return "0";
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
