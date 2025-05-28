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
} from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

export default function Home() {
  return (
    <PageLayout>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-600">
                  Total Balance
                </p>
                <h3 className="text-2xl font-bold text-primary-900">
                  0.00 ETH
                </h3>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <Wallet className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-600">
                  24h Change
                </p>
                <h3 className="text-2xl font-bold text-green-600">+2.5%</h3>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-600">
                  Total Tokens
                </p>
                <h3 className="text-2xl font-bold text-primary-900">3</h3>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <Coins className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-600">
                  Transactions
                </p>
                <h3 className="text-2xl font-bold text-primary-900">12</h3>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <History className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest transactions and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Placeholder transactions */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <ArrowUpRight className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-primary-900">Sent ETH</p>
                  <p className="text-sm text-primary-600">To: 0x1234...5678</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-primary-900">-0.1 ETH</p>
                <p className="text-sm text-primary-600">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <ArrowDownLeft className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-primary-900">Received ETH</p>
                  <p className="text-sm text-primary-600">
                    From: 0x8765...4321
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-primary-900">+0.5 ETH</p>
                <p className="text-sm text-primary-600">5 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-50 rounded-lg">
                <Wallet className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary-900">
                  Wallet
                </h3>
                <p className="text-sm text-primary-600">Manage your assets</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-50 rounded-lg">
                <Coins className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary-900">
                  Tokens
                </h3>
                <p className="text-sm text-primary-600">View token balances</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-50 rounded-lg">
                <History className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary-900">
                  History
                </h3>
                <p className="text-sm text-primary-600">
                  View all transactions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
