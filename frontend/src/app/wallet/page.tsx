"use client";

import { useSmartWallet } from "@/hooks/useSmartWallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WalletPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { smartAccount, isLoading } = useSmartWallet();

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Smart Contract Wallet</CardTitle>
          <CardDescription>
            Your smart contract wallet address and balance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {smartAccount ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Address:</p>
                <p className="text-sm text-gray-500 break-all">
                  {smartAccount.accountAddress}
                </p>
              </div>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(smartAccount.accountAddress);
                }}
              >
                Copy Address
              </Button>
            </div>
          ) : (
            <p>No smart contract wallet found. Please register first.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
