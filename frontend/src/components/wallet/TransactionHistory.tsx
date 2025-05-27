import React from "react";
import { formatEther } from "viem";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: bigint;
  timestamp: number;
  type: "send" | "receive";
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  address: string;
}

export function TransactionHistory({
  transactions,
  address,
}: TransactionHistoryProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Transaction History</h3>
      <div className="space-y-2">
        {transactions.map((tx) => (
          <div
            key={tx.hash}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  tx.type === "send" ? "bg-red-100" : "bg-green-100"
                }`}
              >
                {tx.type === "send" ? (
                  <ArrowUpRight className="h-4 w-4 text-red-600" />
                ) : (
                  <ArrowDownLeft className="h-4 w-4 text-green-600" />
                )}
              </div>
              <div>
                <div className="font-medium">
                  {tx.type === "send" ? "Sent" : "Received"}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDistanceToNow(tx.timestamp * 1000, {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`font-medium ${
                  tx.type === "send" ? "text-red-600" : "text-green-600"
                }`}
              >
                {tx.type === "send" ? "-" : "+"}
                {formatEther(tx.value)} ETH
              </div>
              <div className="text-sm text-gray-500">
                {tx.type === "send" ? "To: " : "From: "}
                {tx.type === "send" ? tx.to : tx.from}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
