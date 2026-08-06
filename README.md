# CryptoBoost Δ0

CryptoBoost Δ0 is the original public development phase of a two-leg market-neutral trading project focused on capturing structural yield opportunities while managing directional market exposure.

The project has since evolved into DeltaShield2L, where active development continues in a separate private repository.

> **Project status:** The code in this repository represents an early experimental prototype. Active development of the current system continues privately under the name DeltaShield2L.

---

## Overview

CryptoBoost Δ0 was an early research and development effort around a two-leg market-neutral trading architecture. In plain terms:

- **Two-leg market-neutral architecture** — the system pairs two market positions whose exposures are designed to offset each other, targeting returns from structural relationships between the legs rather than from a single directional bet.
- **Reducing directional exposure** — the core focus is managing and reducing exposure to overall market direction, so that performance is less dependent on whether the market goes up or down.
- **Research and development around centralized and decentralized market infrastructure** — the project explored venues and protocols across both centralized exchanges and decentralized finance (DeFi) infrastructure.
- **Risk management and hedge monitoring** — ongoing work on measuring the hedge, monitoring the relationship between legs, and keeping risk within defined bounds.

This repository intentionally does **not** publish proprietary formulas, exact trading rules, entry or exit logic, infrastructure details, performance claims, or private exchange/protocol configurations.

---

## Project Evolution

```
CryptoBoost Δ0 → DeltaShield2L
```

- **CryptoBoost Δ0** established the early concept and prototype: the two-leg market-neutral idea, early contracts, tooling, and the first experimental deployment work.
- **DeltaShield2L** is the current continuation of the project, where active development now happens.
- Development moved to a **private repository** to protect proprietary implementation and operational security.
- **CryptoBoost Δ0 remains public** as a transparent record of the project's origins.

---

## Repository Contents

This repository contains the early experimental prototype:

- `contracts/` — a Hardhat workspace with Solidity contracts, configuration, deployment scripts, and tests:
  - `src/Delta0Staking.sol` — an experimental staking contract (APR + lock parameters, OpenZeppelin-based)
  - `src/ MockStable.sol` — a mock ERC-20 used for local experimentation (note: the source file name has a leading space, a quirk inherited from the original prototype)
  - `scripts/deploy.js` — deployment script for the Sepolia testnet
  - `test/Delta0Staking.spec.js` — basic Hardhat test suite
  - `deployments/` — recorded Sepolia testnet deployment addresses and links
- `.github/` — repository tooling: issue templates, pull request template, CODEOWNERS, Dependabot config, labels, and GitHub Actions workflows:
  - `workflows/contracts-ci.yml` — compile + test CI for the contracts
  - `workflows/deploy-sepolia.yml` — manual workflow to deploy the prototype to Sepolia
- `LICENSE` — MIT License
- `.gitignore`, `.nvmrc`, `.gitattributes` — basic repository configuration

There is no application frontend in this repository; the `app/` directory referenced in older documentation is not present.

---

## Current Development

Current work on the project continues in the private **DeltaShield2L** repository and includes:

- execution and hedge-management infrastructure
- telemetry and monitoring
- risk controls
- testing and operational reliability

This list is intentionally general. It does not claim any completed feature set.

---

## Legacy Prototype Notice

The code in this repository:

- is **experimental**
- is **unaudited**
- is **not maintained as the current production system**
- is **not intended for production deployment**
- is **not financial advice**

Treat everything here as historical research material, not as a system to run with real funds.

---

## Security

If you believe you have found a security issue in this repository, please report it privately rather than opening a public issue with the details. GitHub's private vulnerability reporting is not currently enabled for this repository, so please open a regular issue and include the minimal details needed to reproduce the concern without exposing sensitive information, or contact the repository maintainer directly through GitHub.

---

## License

This repository is licensed under the [MIT License](LICENSE).

Copyright (c) 2025 cryptoboost-defi
