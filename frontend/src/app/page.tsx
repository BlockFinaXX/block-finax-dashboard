"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Coins,
  History,
  TrendingUp,
  Send,
  Download,
  QrCode,
} from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useSession } from "next-auth/react";
import { useSmartWallet } from "@/hooks/useSmartWallet";

export default function Home() {
  const { data: session } = useSession();
  const { smartAccount } = useSmartWallet();

  return (
    <PageLayout>
      {/* Stats Overview */}
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
                    <p className="text-3xl font-bold text-white">$0.00</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white/10 hover:bg-white/20 border-white/20 text-white h-10 w-10"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 truncate">Address</p>
                  <p className="text-sm text-white truncate">
                    {smartAccount?.accountAddress || "Not connected"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white/10 hover:bg-white/20 border-white/20 text-white h-8 w-8"
                >
                  <QrCode className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-600">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-12 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-[#1eb755] hover:to-[#3073ef] text-white text-lg font-medium rounded-xl">
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </Button>
                <Button className="h-12 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-[#1eb755] hover:to-[#3073ef] text-white text-lg font-medium rounded-xl">
                  <Download className="mr-2 h-4 w-4" />
                  Receive
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Market Overview */}
        <div className="space-y-8">
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-600">Market Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8">
                      <img
                        src="/tokens/eth.svg"
                        alt="ETH"
                        className="w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-500">ETH</p>
                      <p className="text-sm text-gray-500">Ethereum</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-500">$2,450.00</p>
                    <p className="text-sm text-green-500">+2.5%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8">
                      <img
                        src="/tokens/usdc.svg"
                        alt="USDC"
                        className="w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-500">USDC</p>
                      <p className="text-sm text-gray-500">USD Coin</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-500">$1.00</p>
                    <p className="text-sm text-gray-500">0.0%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8">
                      <img
                        src="/tokens/usdt.svg"
                        alt="USDT"
                        className="w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-500">USDT</p>
                      <p className="text-sm text-gray-500">Tether</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-500">$1.00</p>
                    <p className="text-sm text-gray-500">0.0%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity - Full Width */}
      <div className="mt-8">
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600">Recent Activity</CardTitle>
            <CardDescription className="text-gray-600">
              Your latest transactions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <ArrowUpRight className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Sent ETH</p>
                    <p className="text-sm text-gray-500">To: 0x1234...5678</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">-0.1 ETH</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <ArrowDownLeft className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Received ETH</p>
                    <p className="text-sm text-gray-500">From: 0x8765...4321</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">+0.5 ETH</p>
                  <p className="text-sm text-gray-500">5 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
