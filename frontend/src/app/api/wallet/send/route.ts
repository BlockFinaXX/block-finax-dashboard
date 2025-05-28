import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { getProvider } from "@/lib/web3";
import { verifyJwt } from "@/utils/jwt";
import User from "@/models/user";
import { connectDB } from "@/lib/db";
import SmartAccountFactoryArtifact from "@/contracts/artifacts/contracts/SmartAccountFactory.sol/SmartAccountFactory.json";

const FACTORY_ADDRESS = process.env.FACTORY_ADDRESS as string;
const PRIVATE_KEY = process.env.PRIVATE_KEY as string;

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const decoded = verifyJwt(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { to, amount } = await req.json();

    if (!to || !amount) {
      return NextResponse.json(
        { error: "Recipient address and amount are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const provider = getProvider();
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const factory = new ethers.Contract(
      FACTORY_ADDRESS,
      SmartAccountFactoryArtifact.abi,
      signer
    );

    // Get the smart account address
    const salt = Date.now();
    const smartAccountAddress = await factory.getAddress(user.address, salt);

    // Create the transaction
    const tx = {
      to,
      value: ethers.parseEther(amount),
      data: "0x",
    };

    // Execute the transaction through the smart account
    const smartAccount = await ethers.getContractAt(
      "SmartAccount",
      smartAccountAddress
    );

    const executeTx = await smartAccount.execute(tx.to, tx.value, tx.data);
    const receipt = await executeTx.wait();

    return NextResponse.json({
      success: true,
      transactionHash: receipt.hash,
    });
  } catch (error) {
    console.error("Error sending transaction:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to send transaction",
      },
      { status: 500 }
    );
  }
}
