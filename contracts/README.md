# CryptoBoost Δ0 – Contracts
Ovo je paket s Hardhat konfiguracijom, ugovorima i testovima.

---

## 📂 Structure

- `contracts/` → Hardhat konfiguracija, ugovori i testovi
- `app/` → (planirani frontend)
- ostali config fajlovi

---

## 📖 Docs

👉 See contracts docs → [contracts/README.md](contracts/README.md)

---

## 🔄 Contribution & Deployment Guide

### 1. Pull Requests

Every change must go through a Pull Request (PR):

* **Branching**: create a feature branch

  ```bash
  git checkout -b feat/short-name
  ```
* **Testing locally**:

  ```bash
  npx --prefix contracts hardhat compile
  npx --prefix contracts hardhat test
  ```
* **PR Template**: fill out **Summary, How to test, Checklist**.
* **Review**: CODEOWNERS automatically assigns @nenaddevic as reviewer.
* ✅ Only merge after tests and review are complete.

---

### 2. Deployment to Sepolia

#### A. Deploy via GitHub Actions (preferred)

1. **Repository Secrets** (Settings → Secrets and variables → Actions → New repository secret):

   * `SEPOLIA_RPC_URL`
   * `PRIVATE_KEY`
   * `ETHERSCAN_API_KEY`

2. **Run Deployment**:

   * Go to **Actions → deploy-sepolia → Run workflow**
   * The workflow will:

     * Checkout code
     * Setup Node 20
     * Install dependencies
     * Compile contracts
     * Deploy to Sepolia using Hardhat

3. **After Deployment**:

   * Copy the deployed contract address
   * Document it (e.g. in README, `.env`, or project notes)

---

#### B. Deploy locally (manual alternative)

1. Make sure you have `.env` in `/contracts/` with:

   ```ini
   SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
   PRIVATE_KEY=0xyourprivatekey
   ETHERSCAN_API_KEY=yourapikey
   ```

2. Run deployment script:

   ```bash
   cd contracts
   npx hardhat run scripts/deploy.js --network sepolia
   ```

3. Output will display the deployed contract address.
   Save it to your notes or update README.

---

### 3. Quick Rules

* One topic = one PR (clearer review & history).
* Always run `compile` + `test` before pushing.
* Never commit `.env`, `node_modules`, or build artifacts.
* Use meaningful commit messages (`feat|fix|chore|ci: …`).

---

