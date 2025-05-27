import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { connectDB } from "../../../lib/db";
import User from "../../../models/user";
import { verifyJwt } from "../../../utils/jwt";
import SmartAccountFactoryArtifact from "@/artifacts/contracts/SmartAccountFactory.sol/SmartAccountFactory.json";
// import { Bundler } from "@account-abstraction/sdk";
import { Bundler } from "@alchemy/aa-sdk";
import { getUserOpHash } from "@account-abstraction/utils";
import { UserOperationStruct } from "@account-abstraction/contracts";

const ENTRY_POINT = process.env.ENTRY_POINT!;
const FACTORY_ADDRESS = process.env.WALLET_FACTORY_ADDRESS!;
const PAYMASTER_ADDRESS = process.env.PAYMASTER_ADDRESS!;
const BUNDLER_RPC = process.env.BUNDLER_RPC_URL!;
const provider = new ethers.JsonRpcProvider(process.env.APECHAIN_RPC_URL!);
const bundler = new Bundler(ENTRY_POINT, BUNDLER_RPC);

export async function POST(req: NextRequest) {
  const WalletFactoryABI = SmartAccountFactoryArtifact.abi;
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

  const decoded = verifyJwt(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(decoded.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const salt = Date.now(); // or a deterministic value
  const factory = new ethers.Contract(
    FACTORY_ADDRESS,
    WalletFactoryABI,
    provider
  );

  const predictedAddress = await factory.getAddress(user.address, salt);

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider); // signer

  const iface = new ethers.Interface(WalletFactoryABI);
  const initCode =
    FACTORY_ADDRESS +
    iface.encodeFunctionData("createWallet", [user.address, salt]).slice(2);

  // Estimate gas (rough estimate)
  const callGasLimit = 1_000_000;
  const verificationGasLimit = 1_000_000;
  const preVerificationGas = 21_000;

  const maxFeePerGas = ethers.parseUnits("20", "gwei");
  const maxPriorityFeePerGas = ethers.parseUnits("1", "gwei");

  const nonce = await provider.call({
    to: ENTRY_POINT,
    data: new ethers.Interface([
      "function getNonce(address sender, uint192 key) view returns (uint256)",
    ]).encodeFunctionData("getNonce", [predictedAddress, 0]),
  });

  const userOp: UserOperationStruct = {
    sender: predictedAddress,
    nonce,
    initCode,
    callData: "0x",
    callGasLimit,
    verificationGasLimit,
    preVerificationGas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    paymasterAndData: PAYMASTER_ADDRESS, // NOTE: This will be just address if not sending additional context
    signature: "0x", // placeholder until signed
  };

  const chainId = (await provider.getNetwork()).chainId;
  const opHash = await getUserOpHash(userOp, ENTRY_POINT, chainId);
  const signature = await wallet.signMessage(ethers.getBytes(opHash));
  userOp.signature = signature;

  const bundlerResponse = await bundler.sendUserOpToBundler(userOp);

  user.walletAddress = predictedAddress;
  await user.save();

  return NextResponse.json({
    walletAddress: predictedAddress,
    bundlerResponse,
  });
}
