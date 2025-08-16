const { expect } = require("chai");
const { ethers, network } = require("hardhat");

describe("Delta0Staking", function () {
  it("accrues rewards, claims, and unlocks after lock", async function () {
    const [owner, user] = await ethers.getSigners();

    const Mock = await ethers.getContractFactory("MockStable");
    const mock = await Mock.deploy();
    await mock.waitForDeployment();
    const token = await mock.getAddress();

    const aprBps = 1000, lock = 7 * 24 * 60 * 60;
    const Staking = await ethers.getContractFactory("Delta0Staking");
    const staking = await Staking.deploy(token, aprBps, lock, owner.address);
    await staking.waitForDeployment();
    const addr = await staking.getAddress();

    const ONE = ethers.parseEther("1");
    await (await mock.mint(addr, ONE * 10000n)).wait();
    await (await mock.mint(user.address, ONE * 1000n)).wait();
    await (await mock.connect(user).approve(addr, ONE * 1000n)).wait();
    await (await staking.connect(user).stake(ONE * 1000n)).wait();

    await network.provider.send("evm_increaseTime", [30 * 24 * 60 * 60]);
    await network.provider.send("evm_mine");
    const pending = await staking.pendingReward(user.address);
    expect(pending).to.be.gt(0n);

    const before = await mock.balanceOf(user.address);
    await (await staking.connect(user).claim()).wait();
    const after = await mock.balanceOf(user.address);
    expect(after).to.be.gt(before);

    await expect(staking.connect(user).unstake(ONE * 1000n)).to.be.revertedWith("locked");
    await network.provider.send("evm_increaseTime", [lock]);
    await network.provider.send("evm_mine");
    await expect(staking.connect(user).unstake(ONE * 1000n)).to.not.be.reverted;
  });
});
