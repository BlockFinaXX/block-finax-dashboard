import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createWallet, getOwnerAddress } from "@/utils/auth";

export function useWallet() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateWallet = async () => {
    setIsLoading(true);
    try {
      const ownerAddress = await getOwnerAddress();
      const { address } = await createWallet();

      toast({
        title: "Success",
        description: "Smart contract wallet created successfully",
      });

      return { address, ownerAddress };
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create wallet",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createWallet: handleCreateWallet,
    isLoading,
  };
}
