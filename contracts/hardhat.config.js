require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: { version: "0.8.20", settings: { optimizer: { enabled: true, runs: 200 } } },
  paths: { sources: "./src" }, // .sol datoteke su u /contracts/src
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  etherscan: { apiKey: process.env.ETHERSCAN_API_KEY || "" }
};
