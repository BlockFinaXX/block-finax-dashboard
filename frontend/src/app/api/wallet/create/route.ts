import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import SmartAccountFactoryArtifact from "@/contracts/artifacts/contracts/SmartAccountFactory.sol/SmartAccountFactory.json";
import { getProvider, getBundler } from "@/lib/web3";
import User from "@/models/user";
import { connectDB } from "@/lib/db";
import { Model } from "mongoose";

const FACTORY_ADDRESS = process.env.FACTORY_ADDRESS as string;
const PRIVATE_KEY = process.env.PRIVATE_KEY as string;

// Define the contract type
type SmartAccountFactory = ethers.Contract & {
  createWallet: (
    owner: string,
    salt: number,
    overrides?: any
  ) => Promise<ethers.ContractTransactionResponse>;
  getAddress: (owner: string, salt: number) => Promise<string>;
};

export async function POST(req: NextRequest) {
  try {
    const { ownerAddress } = await req.json();

    if (!ownerAddress) {
      return NextResponse.json(
        { error: "Owner address is required" },
        { status: 400 }
      );
    }

    if (!FACTORY_ADDRESS) {
      console.error("FACTORY_ADDRESS is not set in environment variables");
      return NextResponse.json(
        { error: "Factory address not configured" },
        { status: 500 }
      );
    }

    if (!PRIVATE_KEY) {
      console.error("PRIVATE_KEY is not set in environment variables");
      return NextResponse.json(
        { error: "Private key not configured" },
        { status: 500 }
      );
    }

    console.log("Creating wallet with:", {
      ownerAddress,
      factoryAddress: FACTORY_ADDRESS,
    });

    const provider = getProvider();
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);

    console.log("Transaction signer address:", await signer.getAddress());

    const factory = new ethers.Contract(
      FACTORY_ADDRESS,
      SmartAccountFactoryArtifact.abi,
      signer
    );

    // Verify contract is deployed
    const code = await provider.getCode(FACTORY_ADDRESS);
    console.log("Contract code length:", code.length);
    if (code.length <= 2) {
      return NextResponse.json(
        { error: "Factory contract not deployed at specified address" },
        { status: 500 }
      );
    }

    // Test reading from contract
    try {
      const entryPoint = await factory.entryPoint();
      console.log("Entry point address:", entryPoint);
    } catch (error) {
      console.error("Error reading from contract:", error);
      return NextResponse.json(
        { error: "Failed to read from factory contract" },
        { status: 500 }
      );
    }

    // Verify EntryPoint contract
    const entryPointAddress = "0xD333403Fd54d3be299bD7b39Fdf394bb7B7B065e";
    const entryPointCode = await provider.getCode(entryPointAddress);
    console.log("EntryPoint code length:", entryPointCode.length);
    if (entryPointCode.length <= 2) {
      return NextResponse.json(
        { error: "EntryPoint contract not deployed at specified address" },
        { status: 500 }
      );
    }

    // Create smart account with explicit gas limit and data
    console.log("Sending createWallet transaction...");
    const salt = Date.now(); // Use timestamp as salt like in tests

    // Get predicted address first
    const predictedAddress = await factory.getAddress(ownerAddress, salt);
    console.log("Predicted wallet address:", predictedAddress);

    // Prepare transaction
    const createWalletTx = await factory.createWallet.populateTransaction(
      ownerAddress,
      salt,
      {
        gasLimit: 5000000,
        type: 2,
      }
    );
    console.log("Transaction data:", createWalletTx);

    // Call the contract method directly
    const tx = await factory.createWallet(ownerAddress, salt, {
      gasLimit: 5000000,
      type: 2,
    });
    console.log("Transaction sent:", tx.hash);

    console.log("Waiting for transaction confirmation...");
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt.hash);

    // Get the created account address from the event
    const event = receipt.logs.find(
      (log: any) =>
        log.topics[0] ===
        factory.interface.getEvent("WalletDeployed")?.topicHash
    );

    if (!event) {
      console.error("WalletDeployed event not found in logs:", receipt.logs);
      return NextResponse.json(
        { error: "Failed to find wallet creation event" },
        { status: 500 }
      );
    }

    // Parse the event data
    const decodedLog = factory.interface.parseLog({
      topics: event.topics,
      data: event.data,
    });

    const accountAddress = decodedLog?.args[0];
    console.log("Wallet created successfully:", accountAddress);

    // Update user's wallet address in database
    try {
      await connectDB();
      console.log("Updating user record for address:", ownerAddress);

      // First check if user exists
      const UserModel = User as Model<any>;
      let user = await UserModel.findOne({ address: ownerAddress });

      if (!user) {
        console.error("No user found with address:", ownerAddress);
        return NextResponse.json(
          { error: "User must register before creating a wallet" },
          { status: 400 }
        );
      }

      // Update existing user's wallet address
      user = await UserModel.findOneAndUpdate(
        { address: ownerAddress },
        { $set: { walletAddress: accountAddress } },
        { new: true }
      );

      console.log("User record updated successfully:", user);
      return NextResponse.json({
        address: accountAddress,
        user: {
          email: user.email,
          address: user.address,
          walletAddress: user.walletAddress,
        },
      });
    } catch (dbError) {
      console.error("Database update error:", dbError);
      return NextResponse.json(
        { error: "Failed to update user record", details: dbError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Wallet creation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create wallet",
      },
      { status: 500 }
    );
  }
}
