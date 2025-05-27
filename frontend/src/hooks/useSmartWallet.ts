import { useCallback, useEffect, useState } from "react";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { SmartAccountClient } from "@alchemy/aa-core";
import { useSession } from "next-auth/react";

const ENTRY_POINT = process.env.NEXT_PUBLIC_ENTRY_POINT!;
const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS!;
const PAYMASTER_ADDRESS = process.env.NEXT_PUBLIC_PAYMASTER_ADDRESS!;
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!;

export function useSmartWallet() {
  const { data: session } = useSession();
  const [smartAccount, setSmartAccount] = useState<SmartAccountClient | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const initializeSmartWallet = useCallback(async () => {
    if (!session?.user?.email) return;

    try {
      const provider = new AlchemyProvider({
        apiKey: ALCHEMY_API_KEY,
        chain: "base-sepolia",
      });

      // Get the smart account address from your backend
      const response = await fetch("/api/wallet/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
        }),
      });

      const { address } = await response.json();

      if (!address) {
        throw new Error("No smart account address found");
      }

      const smartAccountClient = new SmartAccountClient({
        provider,
        entryPointAddress: ENTRY_POINT,
        factoryAddress: FACTORY_ADDRESS,
        paymasterAddress: PAYMASTER_ADDRESS,
        accountAddress: address,
      });

      setSmartAccount(smartAccountClient);
    } catch (error) {
      console.error("Failed to initialize smart wallet:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    initializeSmartWallet();
  }, [initializeSmartWallet]);

  return {
    smartAccount,
    isLoading,
  };
}
