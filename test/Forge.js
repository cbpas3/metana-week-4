const { ethers } = require("hardhat");
const { expect } = require("chai");
const { BigNumber } = ethers;

const easyMint = async (contract, account, id) => {
  const mintTx = await contract.connect(account).forge(id);
  await mintTx.wait();
  return true;
};

describe("Forge", function () {
  let contractERC1155 = null;
  let contractForging = null;
  let accounts = null;
  let provider = null;
  const RED_TOKEN_ID = 0;
  const BLACK_TOKEN_ID = 1;
  const BLUE_TOKEN_ID = 2;
  const BROWN_TOKEN_ID = 3;
  const GREEN_TOKEN_ID = 4;
  const ORANGE_TOKEN_ID = 5;
  const PINK_TOKEN_ID = 6;
  const ONE_MINUTE = 60;

  beforeEach(async function () {
    const ContractFactoryERC1155 = await ethers.getContractFactory("ForgeNFTs");
    contractERC1155 = await ContractFactoryERC1155.deploy();
    await contractERC1155.deployed();

    const ContractFactoryForging = await ethers.getContractFactory(
      "ForgingPart"
    );
    contractForging = await ContractFactoryForging.deploy(
      contractERC1155.address
    );
    await contractForging.deployed();

    accounts = await ethers.getSigners();
    provider = await ethers.provider;

    contractERC1155.allowToMintDirectly(contractForging.address);
    twentyThousandEtherInHex = ethers.utils.hexStripZeros(
      ethers.utils.parseEther("20000").toHexString()
    );
    await provider.send("hardhat_setBalance", [
      accounts[1].address,
      twentyThousandEtherInHex,
    ]);
  });

  describe("forge", async function () {
    it("should mint one red token to the buyer", async function () {
      //   await provider.send("hardhat_mine", [
      //     ethers.utils.hexStripZeros(ethers.utils.hexValue(1000)),
      //   ]);
      await easyMint(contractForging, accounts[1], 0);
      expect(await contractERC1155.balanceOf(accounts[1].address, 0)).to.equal(
        new BigNumber.from("1")
      );
    });

    it("should revert because mint is still on cooldown", async function () {
      await easyMint(contractForging, accounts[1], 0);

      await expect(
        contractForging.connect(accounts[1]).forge(0)
      ).to.be.revertedWith(
        "ForgeNFTs: Not enough time has passed since the last mint."
      );
    });

    it("should allow the second mint because a minute has passed. Buyer should have 2 tokens.", async function () {
      await easyMint(contractForging, accounts[1], RED_TOKEN_ID);
      await provider.send("evm_increaseTime", [ONE_MINUTE]);
      await provider.send("evm_mine");
      await easyMint(contractForging, accounts[1], RED_TOKEN_ID);
      expect(
        await contractERC1155.balanceOf(accounts[1].address, RED_TOKEN_ID)
      ).to.equal(new BigNumber.from("2"));
    });

    it("should mint one black token to the buyer.", async function () {
      await easyMint(contractForging, accounts[1], BLACK_TOKEN_ID);
      expect(
        await contractERC1155.balanceOf(accounts[1].address, BLACK_TOKEN_ID)
      ).to.equal(new BigNumber.from("1"));
    });

    it("should mint one blue token to the buyer.", async function () {
      await easyMint(contractForging, accounts[1], BLUE_TOKEN_ID);
      expect(
        await contractERC1155.balanceOf(accounts[1].address, BLUE_TOKEN_ID)
      ).to.equal(new BigNumber.from("1"));
    });

    it("should mint one brown token to the buyer.", async function () {
      await easyMint(contractForging, accounts[1], RED_TOKEN_ID);
      await provider.send("evm_increaseTime", [ONE_MINUTE]);
      await provider.send("evm_mine");
      await easyMint(contractForging, accounts[1], BLACK_TOKEN_ID);
      await easyMint(contractForging, accounts[1], BROWN_TOKEN_ID);
      expect(
        await contractERC1155.balanceOf(accounts[1].address, BROWN_TOKEN_ID)
      ).to.equal(new BigNumber.from("1"));
    });

    it("should revert because the user doesn't have a red token.", async function () {
      await easyMint(contractForging, accounts[1], BLACK_TOKEN_ID);
      await expect(
        contractForging.connect(accounts[1]).forge(BROWN_TOKEN_ID)
      ).to.be.revertedWith("ForgeNFTs: Not enough Red tokens.");
    });

    it("should revert because the user doesn't have a black token.", async function () {
      await easyMint(contractForging, accounts[1], RED_TOKEN_ID);
      await expect(
        contractForging.connect(accounts[1]).forge(BROWN_TOKEN_ID)
      ).to.be.revertedWith("ForgeNFTs: Not enough Black tokens.");
    });

    it("should mint one green token to the buyer.", async function () {
      await easyMint(contractForging, accounts[1], BLUE_TOKEN_ID);
      await provider.send("evm_increaseTime", [ONE_MINUTE]);
      await provider.send("evm_mine");
      await easyMint(contractForging, accounts[1], BLACK_TOKEN_ID);
      await easyMint(contractForging, accounts[1], GREEN_TOKEN_ID);
      expect(
        await contractERC1155.balanceOf(accounts[1].address, GREEN_TOKEN_ID)
      ).to.equal(new BigNumber.from("1"));
    });

    it("should revert because the user doesn't have a Blue token.", async function () {
      await easyMint(contractForging, accounts[1], BLACK_TOKEN_ID);
      await expect(
        contractForging.connect(accounts[1]).forge(GREEN_TOKEN_ID)
      ).to.be.revertedWith("ForgeNFTs: Not enough Blue tokens.");
    });

    it("should revert because the user doesn't have a black token.", async function () {
      await easyMint(contractForging, accounts[1], BLUE_TOKEN_ID);
      await expect(
        contractForging.connect(accounts[1]).forge(GREEN_TOKEN_ID)
      ).to.be.revertedWith("ForgeNFTs: Not enough Black tokens.");
    });

    it("should mint one orange token to the buyer.", async function () {
      await easyMint(contractForging, accounts[1], BLUE_TOKEN_ID);
      await provider.send("evm_increaseTime", [ONE_MINUTE]);
      await provider.send("evm_mine");
      await easyMint(contractForging, accounts[1], RED_TOKEN_ID);
      await easyMint(contractForging, accounts[1], ORANGE_TOKEN_ID);
      expect(
        await contractERC1155.balanceOf(accounts[1].address, ORANGE_TOKEN_ID)
      ).to.equal(new BigNumber.from("1"));
    });

    it("should revert because the user doesn't have a blue token.", async function () {
      await easyMint(contractForging, accounts[1], RED_TOKEN_ID);
      await expect(
        contractForging.connect(accounts[1]).forge(ORANGE_TOKEN_ID)
      ).to.be.revertedWith("ForgeNFTs: Not enough Blue tokens.");
    });

    it("should revert because the user doesn't have a red token.", async function () {
      await easyMint(contractForging, accounts[1], BLUE_TOKEN_ID);
      await expect(
        contractForging.connect(accounts[1]).forge(ORANGE_TOKEN_ID)
      ).to.be.revertedWith("ForgeNFTs: Not enough Red tokens.");
    });

    it("should mint one pink token to the buyer.", async function () {
      await easyMint(contractForging, accounts[1], BLUE_TOKEN_ID);
      await provider.send("evm_increaseTime", [ONE_MINUTE]);
      await provider.send("evm_mine");
      await easyMint(contractForging, accounts[1], RED_TOKEN_ID);
      await provider.send("evm_increaseTime", [ONE_MINUTE]);
      await provider.send("evm_mine");
      await easyMint(contractForging, accounts[1], BLACK_TOKEN_ID);
      await easyMint(contractForging, accounts[1], PINK_TOKEN_ID);
      expect(
        await contractERC1155.balanceOf(accounts[1].address, PINK_TOKEN_ID)
      ).to.equal(new BigNumber.from("1"));
    });

    it("should revert because the user doesn't have a blue token.", async function () {
      await easyMint(contractForging, accounts[1], RED_TOKEN_ID);
      await provider.send("evm_increaseTime", [ONE_MINUTE]);
      await provider.send("evm_mine");
      await easyMint(contractForging, accounts[1], BLACK_TOKEN_ID);
      await expect(
        contractForging.connect(accounts[1]).forge(PINK_TOKEN_ID)
      ).to.be.revertedWith("ForgeNFTs: Not enough Blue tokens.");
    });

    it("should revert because the user doesn't have a black token.", async function () {
      await easyMint(contractForging, accounts[1], RED_TOKEN_ID);
      await provider.send("evm_increaseTime", [ONE_MINUTE]);
      await provider.send("evm_mine");
      await easyMint(contractForging, accounts[1], BLUE_TOKEN_ID);
      await expect(
        contractForging.connect(accounts[1]).forge(PINK_TOKEN_ID)
      ).to.be.revertedWith("ForgeNFTs: Not enough Black tokens.");
    });

    it("should revert because the user doesn't have a red token.", async function () {
      await easyMint(contractForging, accounts[1], BLUE_TOKEN_ID);
      await provider.send("evm_increaseTime", [ONE_MINUTE]);
      await provider.send("evm_mine");
      await easyMint(contractForging, accounts[1], BLACK_TOKEN_ID);
      await expect(
        contractForging.connect(accounts[1]).forge(PINK_TOKEN_ID)
      ).to.be.revertedWith("ForgeNFTs: Not enough Red tokens.");
    });

    //     it("should revert saying not enough", async function () {
    //       await expect(
    //         contract
    //           .connect(accounts[1])
    //           .mint({ value: ethers.utils.parseEther("0.5") })
    //       ).to.be.revertedWith("CysToken: Wrong amount of Eth sent.");
    //     });

    //     it("should revert saying that the contract does not have tokens", async function () {
    //       const counter = [...Array(1000).keys()];
    //       for await (const count of counter) {
    //         await easyMint(contract, accounts[1]);
    //       }

    //       await expect(
    //         contract
    //           .connect(accounts[1])
    //           .mint({ value: ethers.utils.parseEther("1.0") })
    //       ).to.be.revertedWith("CysToken: Insufficient tokens in contract.");
    //     });

    //     it("should send tokens that the contract owns once the mint cap is reached", async function () {
    //       // REACHING MINT CAP
    //       const counter = [...Array(1000).keys()];
    //       for await (const count of counter) {
    //         await easyMint(contract, accounts[1]);
    //       }

    //       let refundTx = await contract.connect(accounts[1]).refund();
    //       await refundTx.wait();

    //       await easyMint(contract, accounts[1]);
    //       expect(await contract.balanceOf(accounts[1].address)).to.equal(
    //         new BigNumber.from("1000000000000000000000000")
    //       );
    //     });
  });
  describe("trade", async () => {
    it("should revert because the user has no tokens to trade in", async () => {
      await expect(
        contractForging.trade(GREEN_TOKEN_ID, RED_TOKEN_ID)
      ).to.be.revertedWith("ForgeNFTs: No token to trade in.");
    });

    it("should revert because only tokens with IDs < 3 are allowed.", async () => {
      await easyMint(contractForging, accounts[1], BLUE_TOKEN_ID);
      await provider.send("evm_increaseTime", [ONE_MINUTE]);
      await provider.send("evm_mine");
      await easyMint(contractForging, accounts[1], BLACK_TOKEN_ID);
      await easyMint(contractForging, accounts[1], GREEN_TOKEN_ID);

      await expect(
        contractForging
          .connect(accounts[1])
          .trade(GREEN_TOKEN_ID, PINK_TOKEN_ID)
      ).to.be.revertedWith("ForgeNFTs: You can't trade for those tokens.");
    });

    it("should give 1 red token to user.", async () => {
      await easyMint(contractForging, accounts[1], BLUE_TOKEN_ID);
      await provider.send("evm_increaseTime", [ONE_MINUTE]);
      await provider.send("evm_mine");
      await easyMint(contractForging, accounts[1], BLACK_TOKEN_ID);
      await easyMint(contractForging, accounts[1], GREEN_TOKEN_ID);
      let forgeTx = await contractForging
        .connect(accounts[1])
        .trade(GREEN_TOKEN_ID, RED_TOKEN_ID);
      await forgeTx.wait();
      expect(
        await contractERC1155.balanceOf(accounts[1].address, RED_TOKEN_ID)
      ).to.equal(new BigNumber.from("1"));
    });

    it("should burn the green token.", async () => {
      await easyMint(contractForging, accounts[1], BLUE_TOKEN_ID);
      await provider.send("evm_increaseTime", [ONE_MINUTE]);
      await provider.send("evm_mine");
      await easyMint(contractForging, accounts[1], BLACK_TOKEN_ID);
      await easyMint(contractForging, accounts[1], GREEN_TOKEN_ID);
      let forgeTx = await contractForging
        .connect(accounts[1])
        .trade(GREEN_TOKEN_ID, RED_TOKEN_ID);
      await forgeTx.wait();
      expect(
        await contractERC1155.balanceOf(accounts[1].address, GREEN_TOKEN_ID)
      ).to.equal(new BigNumber.from("0"));
    });
  });

  describe("smelt", async () => {
    it("should revert because only tokens with IDs higher than 2 are allowed to be burned", async () => {
      await expect(
        contractForging.connect(accounts[1]).smelt(RED_TOKEN_ID)
      ).to.be.revertedWith("ForgeNFTs: You can't burn this token.");
    });

    it("should revert because the user doesn't have any tokens to burn", async () => {
      await expect(
        contractForging.connect(accounts[1]).smelt(GREEN_TOKEN_ID)
      ).to.be.revertedWith("ForgeNFTs: No tokens to burn.");
    });

    it("should burn the users Green token", async () => {
      await easyMint(contractForging, accounts[1], BLUE_TOKEN_ID);
      await provider.send("evm_increaseTime", [ONE_MINUTE]);
      await provider.send("evm_mine");
      await easyMint(contractForging, accounts[1], BLACK_TOKEN_ID);
      await easyMint(contractForging, accounts[1], GREEN_TOKEN_ID);
      let smeltTx = await contractForging
        .connect(accounts[1])
        .smelt(GREEN_TOKEN_ID);
      await smeltTx.wait();
      expect(
        await contractERC1155.balanceOf(accounts[1].address, GREEN_TOKEN_ID)
      ).to.equal(new BigNumber.from("0"));
    });
  });
});
