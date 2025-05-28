"use client";

import { useState } from "react";
import { useSmartWallet } from "@/hooks/useSmartWallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Send,
  Download,
  History,
  Coins,
  Copy,
  ExternalLink,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  ChevronRight,
} from "lucide-react";
import { formatEther } from "viem";

interface Transaction {
  hash: string;
  type: "send" | "receive";
  amount: string;
  timestamp: number;
  status: "pending" | "completed" | "failed";
}

export function WalletDashboard() {
  const { smartAccount, isLoading } = useSmartWallet();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [sendAmount, setSendAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!smartAccount || !sendAmount || !recipientAddress) return;

    setIsSending(true);
    try {
      // Implement send transaction logic here
      toast({
        title: "Transaction Sent",
        description: "Your transaction has been submitted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const copyAddress = () => {
    if (!smartAccount?.accountAddress) return;
    navigator.clipboard.writeText(smartAccount.accountAddress);
    toast({
      title: "Copied!",
      description: "Wallet address copied to clipboard",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Wallet Overview Card */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-primary-600 to-primary-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/80">
                  Total Balance
                </h3>
                <p className="text-3xl font-bold text-white">0.00 ETH</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/80 truncate">Address</p>
              <p className="text-sm text-white truncate">
                {smartAccount?.accountAddress}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={copyAddress}
              className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <Button
          variant="outline"
          className="h-auto py-4 flex flex-col items-center space-y-2 bg-white hover:bg-gray-50"
          onClick={() => setActiveTab("send")}
        >
          <div className="p-2 bg-primary-50 rounded-lg">
            <Send className="h-5 w-5 text-primary-600" />
          </div>
          <span className="text-sm font-medium">Send</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-4 flex flex-col items-center space-y-2 bg-white hover:bg-gray-50"
          onClick={() => setActiveTab("receive")}
        >
          <div className="p-2 bg-primary-50 rounded-lg">
            <Download className="h-5 w-5 text-primary-600" />
          </div>
          <span className="text-sm font-medium">Receive</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-4 flex flex-col items-center space-y-2 bg-white hover:bg-gray-50"
          onClick={() => setActiveTab("history")}
        >
          <div className="p-2 bg-primary-50 rounded-lg">
            <History className="h-5 w-5 text-primary-600" />
          </div>
          <span className="text-sm font-medium">History</span>
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="send">Send</TabsTrigger>
          <TabsTrigger value="receive">Receive</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Send Assets</CardTitle>
              <CardDescription>
                Transfer tokens to another address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-primary-800">
                  Amount
                </Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="pr-20 h-12 text-lg"
                  />
                  <div className="absolute right-3 top-3.5 text-primary-600 font-medium">
                    ETH
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipient" className="text-primary-800">
                  Recipient Address
                </Label>
                <Input
                  id="recipient"
                  placeholder="0x..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="h-12"
                />
              </div>
              <Button
                className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white text-lg font-medium"
                onClick={handleSend}
                disabled={isSending || !sendAmount || !recipientAddress}
              >
                <Send className="mr-2 h-5 w-5" />
                {isSending ? "Sending..." : "Send"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receive">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Receive Assets</CardTitle>
              <CardDescription>
                Share your wallet address to receive assets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-primary-50 rounded-lg">
                <p className="text-sm font-medium text-primary-800 mb-2">
                  Your Address
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-primary-600 break-all">
                    {smartAccount?.accountAddress}
                  </p>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyAddress}
                    className="text-primary-600"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-64 h-64 bg-white rounded-lg flex items-center justify-center border-2 border-dashed border-primary-200">
                  <p className="text-sm text-primary-600">QR Code</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View your past transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Placeholder for transaction history */}
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-primary-600">
                    No transaction history
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
