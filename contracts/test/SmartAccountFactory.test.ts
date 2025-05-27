import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { setupTest } from "./helpers";

describe("SmartAccountFactory", function () {
  describe("Deployment", function () {
    it("Should set the correct entry point", async function () {
      const { factory, entryPoint } = await loadFixture(setupTest);
      expect(await factory.entryPoint()).to.equal(
        await entryPoint.getAddress()
      );
    });

    it("Should set the correct wallet implementation", async function () {
      const { factory } = await loadFixture(setupTest);
      expect(await factory.walletImplementation()).to.not.equal(
        ethers.ZeroAddress
      );
    });
  });

  describe("Wallet Creation", function () {
    it("Should create a new wallet with correct owner", async function () {
      const { factory, user } = await loadFixture(setupTest);

      const salt = Date.now();
      const predictedAddress = await factory.getAddress(user.address, salt);

      await expect(factory.createWallet(user.address, salt))
        .to.emit(factory, "WalletDeployed")
        .withArgs(predictedAddress, user.address);

      // Verify the wallet was created
      const code = await ethers.provider.getCode(predictedAddress);
      expect(code).to.not.equal("0x");
    });

    it("Should not create wallet with same salt", async function () {
      const { factory, user } = await loadFixture(setupTest);

      const salt = Date.now();
      await factory.createWallet(user.address, salt);

      await expect(factory.createWallet(user.address, salt)).to.be.reverted;
    });

    it("Should predict correct address before creation", async function () {
      const { factory, user } = await loadFixture(setupTest);

      const salt = Date.now();
      const predictedAddress = await factory.getAddress(user.address, salt);

      await factory.createWallet(user.address, salt);

      const code = await ethers.provider.getCode(predictedAddress);
      expect(code).to.not.equal("0x");
    });
  });
});
