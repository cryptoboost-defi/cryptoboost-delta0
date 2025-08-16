const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const Mock = await hre.ethers.getContractFactory("MockStable");
  const mock = await Mock.deploy();
  await mock.waitForDeployment();
  const mockAddr = await mock.getAddress();
  console.log("MockStable:", mockAddr);

  const ONE = hre.ethers.parseEther("1");
  await (await mock.mint(deployer.address, ONE * 100000n)).wait();

  const aprBps = 1000, lock = 7 * 24 * 60 * 60;
  const Staking = await hre.ethers.getContractFactory("Delta0Staking");
  const staking = await Staking.deploy(mockAddr, aprBps, lock, deployer.address);
  await staking.waitForDeployment();
  const stakingAddr = await staking.getAddress();
  console.log("Delta0Staking:", stakingAddr);

  await (await mock.mint(stakingAddr, ONE * 10000n)).wait();
  await (await mock.approve(stakingAddr, ONE * 1000n)).wait();
  await (await staking.stake(ONE * 1000n)).wait();
  console.log("✓ Demo OK");
}
main().catch((e)=>{ console.error(e); process.exit(1); });
