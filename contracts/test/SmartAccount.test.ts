import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { setupTest, createUserOperation } from "./helpers";

describe("SmartAccount", function () {
  describe("Deployment", function () {
    it("Should set the correct entry point", async function () {
      const { smartAccount, entryPoint } = await loadFixture(setupTest);
      expect(await smartAccount.entryPoint()).to.equal(
        await entryPoint.getAddress()
      );
    });

    it("Should set the correct owner", async function () {
      const { smartAccount, user } = await loadFixture(setupTest);
      expect(await smartAccount.owner()).to.equal(user.address);
    });
  });

  describe("Account Operations", function () {
    it("Should execute transactions", async function () {
      const { smartAccount, user, owner } = await loadFixture(setupTest);

      const initialBalance = await ethers.provider.getBalance(owner.address);
      const transferAmount = ethers.parseEther("0.1");

      // Create transaction data
      const tx = {
        to: owner.address,
        value: transferAmount,
        data: "0x",
      };

      // Execute transaction
      await smartAccount.connect(user).execute(tx.to, tx.value, tx.data);

      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance - initialBalance).to.equal(transferAmount);
    });

    it("Should not allow non-owner to execute transactions", async function () {
      const { smartAccount, owner } = await loadFixture(setupTest);

      const tx = {
        to: owner.address,
        value: ethers.parseEther("0.1"),
        data: "0x",
      };

      await expect(
        smartAccount.connect(owner).execute(tx.to, tx.value, tx.data)
      ).to.be.revertedWith("Not authorized");
    });

    it("Should handle batch transactions", async function () {
      const { smartAccount, user, owner } = await loadFixture(setupTest);

      const calls = [
        {
          target: owner.address,
          value: ethers.parseEther("0.1"),
          data: "0x",
        },
        {
          target: owner.address,
          value: ethers.parseEther("0.1"),
          data: "0x",
        },
      ];

      const initialBalance = await ethers.provider.getBalance(owner.address);

      await smartAccount.connect(user).executeBatch(calls);

      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance - initialBalance).to.equal(ethers.parseEther("0.2"));
    });
  });

  describe("EntryPoint Integration", function () {
    it("Should validate user operations", async function () {
      const { smartAccount, user } = await loadFixture(setupTest);

      const userOp = createUserOperation(
        await smartAccount.getAddress(),
        0,
        "0x"
      );

      // Test validation
      const validationData = await smartAccount.validateUserOp(
        userOp,
        ethers.keccak256(ethers.toUtf8Bytes("userOpHash")),
        0
      );

      expect(validationData).to.equal(0); // 0 means validation passed
    });
  });
});
