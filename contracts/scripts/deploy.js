// contracts/scripts/deploy.js
const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

/** JSON replacer: pretvori BigInt u string da JSON.stringify ne puca */
const jsonBigInt = (_k, v) => (typeof v === "bigint" ? v.toString() : v);

/** explorer base URL po mreži (dodaj po potrebi) */
const EXPLORER = {
  sepolia: "https://sepolia.etherscan.io/address/",
};

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // 1) Deploy MockStable
  const Mock = await hre.ethers.getContractFactory("MockStable");
  const mock = await Mock.deploy();
  await mock.waitForDeployment();
  const mockAddr = await mock.getAddress();
  console.log("MockStable:", mockAddr);

  // seed
  const ONE = hre.ethers.parseEther("1");
  await (await mock.mint(deployer.address, ONE * 100000n)).wait();

  // 2) Deploy Delta0Staking
  const aprBps = 1000;
  const lock = 7 * 24 * 60 * 60; // 7d
  const Staking = await hre.ethers.getContractFactory("Delta0Staking");
  const staking = await Staking.deploy(mockAddr, aprBps, lock, deployer.address);
  await staking.waitForDeployment();
  const stakingAddr = await staking.getAddress();
  console.log("Delta0Staking:", stakingAddr);

  // demo actions
  await (await mock.mint(stakingAddr, ONE * 10000n)).wait();
  await (await mock.approve(stakingAddr, ONE * 1000n)).wait();
  await (await staking.stake(ONE * 1000n)).wait();
  console.log("✓ Demo OK");

  // 3) Zapiši deployment u deployments/<network>.json (+ links.md)
  const chainId =
    typeof hre.network.config?.chainId !== "undefined"
      ? Number(hre.network.config.chainId)
      : Number((await hre.ethers.provider.getNetwork()).chainId);

  const record = {
    network: hre.network.name,
    chainId,
    deployer: deployer.address,
    contracts: {
      MockStable: {
        address: mockAddr,
        tx: mock.deploymentTransaction() ? mock.deploymentTransaction().hash : undefined,
      },
      Delta0Staking: {
        address: stakingAddr,
        tx: staking.deploymentTransaction() ? staking.deploymentTransaction().hash : undefined,
      },
    },
    // korisno spremiti i ctor argumente
    params: { aprBps, lockSeconds: lock, owner: deployer.address },
    updatedAt: new Date().toISOString(),
  };

  saveDeploymentJson(record);
  writeLinksMarkdown(record);
}

/** Spremi JSON (čuva "history" i "current") */
function saveDeploymentJson(record) {
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  const filePath = path.join(deploymentsDir, `${record.network}.json`);

  fs.mkdirSync(deploymentsDir, { recursive: true });

  let db = { current: {}, history: [] };
  if (fs.existsSync(filePath)) {
    try {
      db = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch {
      // ako JSON nije valjan, prepiši
      db = { current: {}, history: [] };
    }
  }

  db.current = record;
  db.history = db.history || [];
  db.history.push(record);

  fs.writeFileSync(filePath, JSON.stringify(db, jsonBigInt, 2));
  console.log(`📄 Saved deployments to ${path.relative(process.cwd(), filePath)}`);
}

/** Generiraj human-friendly links + verify komande */
function writeLinksMarkdown(record) {
  const { network, contracts, params, deployer } = {
    network: record.network,
    contracts: record.contracts,
    params: record.params,
    deployer: record.deployer,
  };

  const base = EXPLORER[network] || "";
  const md = [
    `# ${capitalize(network)} Deployment — Clickable Links`,
    "",
    `**Network:** ${capitalize(network)}`,
    "",
    `- **Deployer:**`,
    base
      ? `[ \`${deployer}\` ](${base}${deployer})`
      : `\`${deployer}\``,
    "",
    `- **MockStable (ERC-20):**`,
    base
      ? `[ \`${contracts.MockStable.address}\` ](${base}${contracts.MockStable.address})`
      : `\`${contracts.MockStable.address}\``,
    "",
    `- **Delta0Staking:**`,
    base
      ? `[ \`${contracts.Delta0Staking.address}\` ](${base}${contracts.Delta0Staking.address})`
      : `\`${contracts.Delta0Staking.address}\``,
    "",
    "---",
    "",
    "## Verify (optional)",
    "",
    "```bash",
    "# from /contracts",
    `npx hardhat verify --network ${network} ${contracts.MockStable.address}`,
    "",
    `npx hardhat verify --network ${network} \\`,
    `  ${contracts.Delta0Staking.address} \\`,
    `  ${contracts.MockStable.address} \\`,
    `  ${params.aprBps} \\`,
    `  ${params.lockSeconds} \\`,
    `  ${deployer}`,
    "```",
    "",
  ].join("\n");

  const dir = path.join(__dirname, "..", "deployments");
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${network}-links.md`);
  fs.writeFileSync(filePath, md);
  console.log(`🔗 Wrote ${path.relative(process.cwd(), filePath)}`);
}

function capitalize(s) {
  return (s || "").charAt(0).toUpperCase() + (s || "").slice(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
