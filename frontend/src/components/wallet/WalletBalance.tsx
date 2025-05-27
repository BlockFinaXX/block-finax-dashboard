import React from "react";
import { Card } from "../ui/card";
import { formatEther } from "viem";

interface WalletBalanceProps {
  balance: bigint;
  symbol?: string;
}

export function WalletBalance({ balance, symbol = "ETH" }: WalletBalanceProps) {
  return (
    <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
      <div className="text-sm font-medium mb-2">Total Balance</div>
      <div className="text-3xl font-bold">
        {formatEther(balance)} {symbol}
      </div>
    </Card>
  );
}
