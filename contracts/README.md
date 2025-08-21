# CryptoBoost Δ0 – Contracts

Hardhat workspace with smart contracts, config and tests for the CryptoBoost Δ0 project.

[![contracts-ci](https://github.com/cryptoboost-defi/cryptoboost-delta0/actions/workflows/contracts-ci.yml/badge.svg)](https://github.com/cryptoboost-defi/cryptoboost-delta0/actions/workflows/contracts-ci.yml)
[![deploy-sepolia](https://github.com/cryptoboost-defi/cryptoboost-delta0/actions/workflows/deploy-sepolia.yml/badge.svg)](https://github.com/cryptoboost-defi/cryptoboost-delta0/actions/workflows/deploy-sepolia.yml)

---

## 📂 Structure

- `contracts/` → Hardhat config, contracts, scripts & tests  
- `app/` → (planned frontend)  
- other config files (CI, lint, etc.)

---

## 🚀 Quick start (local)

```bash
# compile & test from the repo root
npx --prefix contracts hardhat compile
npx --prefix contracts hardhat test
```

---

## 🔗 Deployment Addresses (Sepolia)

* Clickable links & verify commands:
  [`contracts/deployments/sepolia-links.md`](contracts/deployments/sepolia-links.md)
* Raw JSON (source of truth):
  [`contracts/deployments/sepolia.json`](contracts/deployments/sepolia.json)

---

## 🔄 Contribution & Deployment Guide

### 1) Pull Requests

Every change must go through a Pull Request (PR):

* **Branching**

  ```bash
  git checkout -b feat/short-name
  ```
* **Test locally**

  ```bash
  npx --prefix contracts hardhat compile
  npx --prefix contracts hardhat test
  ```
* **PR Template**: fill out **Summary**, **How to test**, **Checklist**.
* **Review**: CODEOWNERS assigns @nenaddevic.
* ✅ Merge only when tests are green and review is done.

---

### 2) Deployment to Sepolia

#### A) Deploy via GitHub Actions (preferred)

1. **Repository Secrets**
   *Settings → Secrets and variables → Actions → New repository secret*:

   * `SEPOLIA_RPC_URL`
   * `PRIVATE_KEY`
   * `ETHERSCAN_API_KEY`

2. **Run**
   *Actions → deploy-sepolia → Run workflow*.
   The workflow will:

   * checkout code
   * setup Node 20
   * install dependencies
   * compile contracts
   * deploy to **Sepolia** using Hardhat

3. **After Deployment**

   * Addresses are printed in the job logs (search for `Deployer:` / `MockStable:` / `Delta0Staking:`).
   * They are also saved to
     [`contracts/deployments/sepolia.json`](contracts/deployments/sepolia.json)
     and documented with links in
     [`contracts/deployments/sepolia-links.md`](contracts/deployments/sepolia-links.md).

> Optional: enable Etherscan verification — commands are included in
> `contracts/deployments/sepolia-links.md`.

---

#### B) Deploy locally (manual alternative)

1. Create `.env` in **/contracts**:

   ```ini
   SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
   PRIVATE_KEY=0xyourprivatekey
   ETHERSCAN_API_KEY=yourapikey
   ```

2. Run deploy:

   ```bash
   cd contracts
   npx hardhat run scripts/deploy.js --network sepolia
   ```

3. Copy addresses from the console output and (optionally) update
   `contracts/deployments/sepolia.json`.

---

## ✅ Rules of Thumb

* One topic = one PR (clean history & reviews).
* Always run `compile` + `test` before pushing.
* Never commit `.env`, `node_modules`, or build artifacts.
* Use meaningful commit messages (`feat|fix|chore|ci: …`).

---


