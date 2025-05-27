import { ethers } from "ethers";
import { SimpleAccountAPI } from "@account-abstraction/sdk";

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const PIMLICO_API_KEY = process.env.PIMLICO_API_KEY;
const BASE_SEPOLIA_CHAIN_ID = "84532"; // Base Sepolia chain ID

if (!ALCHEMY_API_KEY || !PIMLICO_API_KEY) {
  throw new Error("Missing required environment variables");
}

export const getProvider = () => {
  return new ethers.JsonRpcProvider(
    `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
  );
};

// Extend SimpleAccountAPI to include our custom methods
interface ExtendedSimpleAccountAPI extends SimpleAccountAPI {
  sendUserOperation: (userOp: any) => Promise<string>;
  waitForUserOperation: (
    userOpHash: string
  ) => Promise<ethers.TransactionReceipt>;
}

export const getBundler = (): ExtendedSimpleAccountAPI => {
  const BUNDLER_RPC = `https://api.pimlico.io/v1/${BASE_SEPOLIA_CHAIN_ID}/rpc?apikey=${PIMLICO_API_KEY}`;
  const ENTRY_POINT = process.env.ENTRY_POINT_ADDRESS;
  const FACTORY_ADDRESS = process.env.FACTORY_ADDRESS;

  if (!ENTRY_POINT || !FACTORY_ADDRESS) {
    throw new Error("ENTRY_POINT_ADDRESS and FACTORY_ADDRESS are required");
  }

  const bundler = new SimpleAccountAPI({
    provider: getProvider(),
    entryPointAddress: ENTRY_POINT,
    bundlerUrl: BUNDLER_RPC,
    factoryAddress: FACTORY_ADDRESS,
  }) as ExtendedSimpleAccountAPI;

  // Add custom methods to handle user operations
  bundler.sendUserOperation = async (userOp: any) => {
    const response = await fetch(BUNDLER_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_sendUserOperation",
        params: [userOp, ENTRY_POINT],
      }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.result;
  };

  bundler.waitForUserOperation = async (userOpHash: string) => {
    const provider = getProvider();
    while (true) {
      const response = await fetch(BUNDLER_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getUserOperationReceipt",
          params: [userOpHash],
        }),
      });
      const data = await response.json();
      if (data.result) {
        const receipt = await provider.getTransactionReceipt(
          data.result.receipt.transactionHash
        );
        if (receipt) return receipt;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  return bundler;
};
