import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import SmartAccountFactoryArtifact from "../../../../../artifacts/contracts/contracts/SmartAccountFactory.sol/SmartAccountFactory.json";
import { getProvider, getBundler } from "../../../../lib/web3";

const FACTORY_ADDRESS = process.env.FACTORY_ADDRESS as string;
const PAYMASTER_ADDRESS = process.env.PAYMASTER_ADDRESS as string;

if (!FACTORY_ADDRESS || !PAYMASTER_ADDRESS) {
  throw new Error("Missing required environment variables");
}

export async function POST(req: NextRequest) {
  try {
    const { ownerAddress } = await req.json();

    if (!ownerAddress) {
      return NextResponse.json(
        { error: "Owner address is required" },
        { status: 400 }
      );
    }

    const provider = getProvider();
    const bundler = getBundler();

    // Create factory contract instance
    const factory = new ethers.Contract(
      FACTORY_ADDRESS,
      SmartAccountFactoryArtifact.abi,
      provider
    ) as ethers.Contract & {
      getAddress: (owner: string, salt: number) => Promise<string>;
    };

    // Generate a salt for deterministic address
    const salt = Date.now();

    try {
      // Get the predicted wallet address using the factory's getAddress function
      const walletAddress = await factory.getAddress(ownerAddress, salt);

      // Create the wallet creation transaction
      const tx = {
        target: FACTORY_ADDRESS,
        data: factory.interface.encodeFunctionData("createWallet", [
          ownerAddress,
          salt,
        ]),
      };

      // Create and send the user operation
      const userOp = await bundler.createUnsignedUserOp(tx);

      // Add paymaster data to the user operation
      userOp.paymasterAndData = PAYMASTER_ADDRESS;

      const signedUserOp = await bundler.signUserOp(userOp);

      // Send the user operation through the bundler
      const userOpHash = await bundler.sendUserOperation(signedUserOp);

      // Wait for the transaction to be mined
      const receipt = await bundler.waitForUserOperation(userOpHash);

      return NextResponse.json({
        success: true,
        walletAddress,
        transactionHash: receipt.hash,
      });
    } catch (error: any) {
      console.error("Error in user operation:", error);

      // Provide more detailed error messages
      let errorMessage = "Failed to create wallet";
      if (error.message) {
        if (error.message.includes("insufficient funds")) {
          errorMessage = "Paymaster has insufficient funds for gas payment";
        } else if (error.message.includes("gas required exceeds allowance")) {
          errorMessage = "Gas limit exceeded for wallet creation";
        } else if (error.message.includes("already deployed")) {
          errorMessage = "Wallet already exists for this address";
        }
      }

      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  } catch (error) {
    console.error("Error creating wallet:", error);
    return NextResponse.json(
      { error: "Failed to create wallet" },
      { status: 500 }
    );
  }
}
