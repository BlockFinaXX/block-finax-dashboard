import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import SmartAccountFactoryArtifact from "@/contracts/artifacts/contracts/SmartAccountFactory.sol/SmartAccountFactory.json";
import { getProvider } from "@/lib/web3";
import User from "@/models/user";
import { connectDB } from "@/lib/db";
import { Model } from "mongoose";
import bcrypt from "bcrypt";

const FACTORY_ADDRESS = process.env.FACTORY_ADDRESS as string;
const PRIVATE_KEY = process.env.PRIVATE_KEY as string;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Registration request body:", body);

    const { email, password, ownerAddress } = body;

    // Validate input
    if (!email || !password || !ownerAddress) {
      console.log("Missing required fields:", {
        hasEmail: !!email,
        hasPassword: !!password,
        hasAddress: !!ownerAddress,
      });
      return NextResponse.json(
        { error: "Email, password and owner address are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    await connectDB();
    const UserModel = User as Model<any>;
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { address: ownerAddress }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or address already exists" },
        { status: 400 }
      );
    }

    // Create wallet first
    console.log("Creating wallet for new user...");
    const provider = getProvider();
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const factory = new ethers.Contract(
      FACTORY_ADDRESS,
      SmartAccountFactoryArtifact.abi,
      signer
    );

    // Create smart account
    const salt = Date.now();
    const tx = await factory.createWallet(ownerAddress, salt, {
      gasLimit: 5000000,
      type: 2,
    });
    console.log("Wallet creation transaction sent:", tx.hash);

    // Wait for transaction confirmation
    const receipt = await tx.wait();
    console.log("Wallet creation confirmed");

    // Get the created account address from the event
    const event = receipt.logs.find(
      (log: any) =>
        log.topics[0] ===
        factory.interface.getEvent("WalletDeployed")?.topicHash
    );

    if (!event) {
      return NextResponse.json(
        { error: "Failed to create wallet" },
        { status: 500 }
      );
    }

    const decodedLog = factory.interface.parseLog({
      topics: event.topics,
      data: event.data,
    });

    const walletAddress = decodedLog?.args[0];
    console.log("Wallet created successfully:", walletAddress);

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user with wallet address
    const user = await UserModel.create({
      email,
      passwordHash,
      address: ownerAddress,
      walletAddress,
    });

    return NextResponse.json({
      message: "User registered successfully",
      user: {
        email: user.email,
        address: user.address,
        walletAddress: user.walletAddress,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
