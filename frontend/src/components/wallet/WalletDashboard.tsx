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
import { QRCodeSVG } from "qrcode.react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Token {
  symbol: string;
  name: string;
  balance: string;
  icon: string;
  address: string;
}

const SAMPLE_TOKENS: Token[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    balance: "0.00",
    icon: "/tokens/eth.svg",
    address: "0x...",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    balance: "0.00",
    icon: "/tokens/usdc.svg",
    address: "0x...",
  },
  {
    symbol: "USDT",
    name: "Tether",
    balance: "0.00",
    icon: "/tokens/usdt.svg",
    address: "0x...",
  },
  {
    symbol: "BASE",
    name: "Base",
    balance: "0.00",
    icon: "/tokens/base.svg",
    address: "0x...",
  },
];

interface Transaction {
  hash: string;
  type: "send" | "receive";
  amount: string;
  token: string;
  timestamp: number;
  status: "pending" | "completed" | "failed";
}

export function WalletDashboard() {
  const { smartAccount, isLoading, balance, sendTransaction } =
    useSmartWallet();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("send");
  const [sendAmount, setSendAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token>(SAMPLE_TOKENS[0]);

  const handleSend = async () => {
    if (!smartAccount || !sendAmount || !recipientAddress) return;

    setIsSending(true);
    try {
      const tx = await sendTransaction(recipientAddress, sendAmount);

      toast({
        title: "Transaction Sent",
        description: `Transaction hash: ${tx.hash}`,
      });

      // Reset form
      setSendAmount("");
      setRecipientAddress("");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to send transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const copyAddress = () => {
    if (!smartAccount?.accountAddress) return;
    navigator.clipboard.writeText(smartAccount.accountAddress as string);
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Wallet Overview */}
      <div className="space-y-8">
        {/* Wallet Overview Card */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-primary-600 via-[#1eb755] to-[#3073ef]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white/80">
                    Total Balance
                  </h3>
                  <p className="text-3xl font-bold text-white">
                    {formatEther(BigInt(balance))} ETH
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white h-10 w-10"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/80 truncate">Address</p>
                <p className="text-sm text-white truncate">
                  {typeof smartAccount?.accountAddress === "string"
                    ? smartAccount.accountAddress
                    : "Not connected"}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={copyAddress}
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white h-8 w-8"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Token Balances */}
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600">Token Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2">
              {SAMPLE_TOKENS.map((token) => (
                <div
                  key={token.symbol}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setSelectedToken(token)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8">
                      <img
                        src={token.icon}
                        alt={token.symbol}
                        className="w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-500">
                        {token.symbol}
                      </p>
                      <p className="text-sm text-gray-500">{token.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-500">{token.balance}</p>
                    <p className="text-sm text-gray-500">≈ $0.00</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Send/Receive */}
      <div className="space-y-8">
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600">Send & Receive</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-gray-100 rounded-xl">
                <TabsTrigger
                  value="send"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Send
                </TabsTrigger>
                <TabsTrigger
                  value="receive"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Receive
                </TabsTrigger>
              </TabsList>

              <TabsContent value="send">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-900">Select Token</Label>
                    <Select
                      value={selectedToken.symbol}
                      onValueChange={(value) =>
                        setSelectedToken(
                          SAMPLE_TOKENS.find((t) => t.symbol === value) ||
                            SAMPLE_TOKENS[0]
                        )
                      }
                    >
                      <SelectTrigger className="h-12 rounded-xl bg-white">
                        <SelectValue className="bg-white">
                          <div className="flex items-center space-x-2">
                            <img
                              src={selectedToken.icon}
                              alt={selectedToken.symbol}
                              className="w-6 h-6"
                            />
                            <span>{selectedToken.symbol}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {SAMPLE_TOKENS.map((token) => (
                          <SelectItem key={token.symbol} value={token.symbol}>
                            <div className="flex items-center space-x-2">
                              <img
                                src={token.icon}
                                alt={token.symbol}
                                className="w-6 h-6"
                              />
                              <span>{token.symbol}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-gray-900">
                      Amount
                    </Label>
                    <div className="relative">
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                        className="pr-20 h-12 text-lg rounded-xl"
                      />
                      <div className="absolute right-4 top-3 text-gray-500 font-medium">
                        {selectedToken.symbol}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient" className="text-gray-900">
                      Recipient Address
                    </Label>
                    <Input
                      id="recipient"
                      placeholder="0x..."
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <Button
                    className="w-full h-12 bg-gradient-to-r from-primary-600 to-purple- hover:from-[#1eb755] hover:to-[#3073ef] text-white text-lg font-medium rounded-xl"
                    onClick={handleSend}
                    disabled={isSending || !sendAmount || !recipientAddress}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isSending ? "Sending..." : "Send"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="receive">
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-800 mb-2">
                      Your Address
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 break-all">
                        {smartAccount?.accountAddress as string}
                      </p>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={copyAddress}
                        className="text-gray-600 h-8 w-8 rounded-xl"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-64 h-64 bg-white rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
                      <QRCodeSVG
                        value={smartAccount?.accountAddress as string}
                        size={250}
                        level="H"
                        includeMargin={true}
                        className="p-0"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History - Full Width */}
      <div className="lg:col-span-2">
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600">Transaction History</CardTitle>
            <CardDescription className="text-gray-600">
              View your past transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Placeholder for transaction history */}
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <History className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">
                    No transaction history
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
