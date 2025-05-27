"use client";

import React from "react";
import { WagmiProvider as WagmiProviderV2, createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { SmartAccountClient } from "@alchemy/aa-core";

const ENTRY_POINT = process.env.NEXT_PUBLIC_ENTRY_POINT!;
const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS!;
const PAYMASTER_ADDRESS = process.env.NEXT_PUBLIC_PAYMASTER_ADDRESS!;
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!;

const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProviderV2 config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProviderV2>
  );
}
