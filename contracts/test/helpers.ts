import { ethers } from "hardhat";
import { SmartAccountFactory } from "../typechain-types";
import { Paymaster } from "../typechain-types";
import { SmartAccount } from "../typechain-types";
import EntryPointABI from "./EntryPoint.json";

export interface TestContext {
  entryPoint: any; // Using any for now since we're using a custom ABI
  factory: SmartAccountFactory;
  paymaster: Paymaster;
  owner: any;
  user: any;
  smartAccount: SmartAccount;
}

export async function setupTest(): Promise<TestContext> {
  const [owner, user] = await ethers.getSigners();

  // Get EntryPoint contract instance
  const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"; // Mainnet EntryPoint address
  const entryPoint = new ethers.Contract(
    entryPointAddress,
    EntryPointABI.abi,
    owner
  );

  // Deploy SmartAccountFactory
  const SmartAccountFactory = await ethers.getContractFactory(
    "SmartAccountFactory"
  );
  const factory = await SmartAccountFactory.deploy(entryPointAddress);

  // Deploy Paymaster
  const Paymaster = await ethers.getContractFactory("Paymaster");
  const paymaster = await Paymaster.deploy(
    entryPointAddress,
    ethers.parseEther("1"), // 1 ETH gas limit
    owner.address
  );

  // Create a smart account for testing
  const salt = Date.now();
  await factory.createWallet(user.address, salt);
  const smartAccountAddress = await factory.getAddress(user.address, salt);
  const smartAccount = await ethers.getContractAt(
    "SmartAccount",
    smartAccountAddress
  );

  // Fund the paymaster and smart account
  await owner.sendTransaction({
    to: await paymaster.getAddress(),
    value: ethers.parseEther("2"), // Send 2 ETH
  });

  await owner.sendTransaction({
    to: smartAccountAddress,
    value: ethers.parseEther("1"), // Send 1 ETH
  });

  return {
    entryPoint,
    factory,
    paymaster,
    owner,
    user,
    smartAccount,
  };
}

export function createUserOperation(
  sender: string,
  nonce: number,
  callData: string,
  maxFeePerGas: bigint = ethers.parseEther("0.000000001"),
  maxPriorityFeePerGas: bigint = ethers.parseEther("0.000000001")
) {
  const callGasLimit = ethers.parseEther("0.1");
  const verificationGasLimit = ethers.parseEther("0.1");
  const preVerificationGas = ethers.parseEther("0.1");

  // Pack gas limits into a single bytes32
  const accountGasLimits = ethers.solidityPacked(
    ["uint128", "uint128"],
    [callGasLimit, verificationGasLimit]
  );

  // Pack gas fees into a single bytes32
  const gasFees = ethers.solidityPacked(
    ["uint128", "uint128"],
    [maxFeePerGas, maxPriorityFeePerGas]
  );

  return {
    sender,
    nonce,
    initCode: "0x",
    callData,
    accountGasLimits,
    preVerificationGas,
    gasFees,
    paymasterAndData: "0x",
    signature: "0x",
  };
}
