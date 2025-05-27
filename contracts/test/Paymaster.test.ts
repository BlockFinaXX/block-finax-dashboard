import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { setupTest, createUserOperation } from "./helpers";

describe("Paymaster", function () {
  describe("Deployment", function () {
    it("Should set the correct entry point", async function () {
      const { paymaster, entryPoint } = await loadFixture(setupTest);
      expect(await paymaster.entryPoint()).to.equal(
        await entryPoint.getAddress()
      );
    });

    it("Should set the correct gas limit", async function () {
      const { paymaster } = await loadFixture(setupTest);
      expect(await paymaster.gasLimit()).to.equal(ethers.parseEther("1"));
    });

    it("Should set the correct owner", async function () {
      const { paymaster, owner } = await loadFixture(setupTest);
      expect(await paymaster.owner()).to.equal(owner.address);
    });
  });

  describe("Gas Limit Management", function () {
    it("Should allow owner to update gas limit", async function () {
      const { paymaster, owner } = await loadFixture(setupTest);
      const newGasLimit = ethers.parseEther("2");

      await paymaster.connect(owner).setGasLimit(newGasLimit);
      expect(await paymaster.gasLimit()).to.equal(newGasLimit);
    });

    it("Should not allow non-owner to update gas limit", async function () {
      const { paymaster, user } = await loadFixture(setupTest);
      const newGasLimit = ethers.parseEther("2");

      await expect(
        paymaster.connect(user).setGasLimit(newGasLimit)
      ).to.be.revertedWithCustomError(paymaster, "OwnableUnauthorizedAccount");
    });
  });

  describe("Paymaster Operations", function () {
    it("Should accept ETH deposits", async function () {
      const { paymaster, owner } = await loadFixture(setupTest);
      const depositAmount = ethers.parseEther("1");

      await owner.sendTransaction({
        to: await paymaster.getAddress(),
        value: depositAmount,
      });

      const balance = await ethers.provider.getBalance(
        await paymaster.getAddress()
      );
      expect(balance).to.equal(ethers.parseEther("3")); // 2 ETH initial + 1 ETH new deposit
    });

    it("Should validate user operations correctly", async function () {
      const { paymaster, smartAccount } = await loadFixture(setupTest);

      const userOp = createUserOperation(
        await smartAccount.getAddress(),
        0,
        "0x"
      );

      // Test validation
      const [context, validationData] = await paymaster.validatePaymasterUserOp(
        userOp,
        ethers.keccak256(ethers.toUtf8Bytes("userOpHash")),
        ethers.parseEther("0.1")
      );

      // Should not sponsor non-wallet-creation operations
      expect(validationData).to.not.equal(0);
    });
  });
});
