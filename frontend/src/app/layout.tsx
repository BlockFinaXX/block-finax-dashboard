// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { WagmiProvider } from "@/components/providers/WagmiProvider";
import { ToastProvider } from "@/components/ui/toast";
import Sidebar from "@/components/layout/SideBar";
import Header from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BlockFinax Dashboard",
  description: "Manage your crypto assets with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <WagmiProvider>
            <ToastProvider>
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <div className="flex-1 bg-gray-50">
                    <div className="h-full w-full pl-[200px] pt-[64px]">
                      <div className="h-full w-full max-w-7xl mx-auto px-6 py-8">
                        {children}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ToastProvider>
          </WagmiProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
