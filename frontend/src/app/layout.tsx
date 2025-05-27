// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Sidebar from "../components/layout/SideBar";
import Header from "../components/layout/Header";
import { Inter } from "next/font/google";
import { WagmiProvider } from "@/components/providers/WagmiProvider";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BlockFinax Dashboard",
  description: "Manage your crypto assets with ease",
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <WagmiProvider>
            <Sidebar />
            <div className="ml-64 flex flex-col w-full min-h-screen">
              <Header />
              <main className="mt-16 flex-1 bg-gray-50 p-6">{children}</main>
            </div>
          </WagmiProvider>
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
