# Sepolia Deployment — clickable links

**Network:** Sepolia

- **Deployer:**  
  [`0x16Fdb05c91058C087A0319230902F69B2B584088`](https://sepolia.etherscan.io/address/0x16Fdb05c91058C087A0319230902F69B2B584088)

- **MockStable (ERC-20):**  
  [`0xAC7c0B74C9f6F753331a3DeeC8d40124Ac4f1FB0`](https://sepolia.etherscan.io/address/0xAC7c0B74C9f6F753331a3DeeC8d40124Ac4f1FB0)

- **Delta0Staking:**  
  [`0x3D82488b4E9E5952f7B54853f649B2B292e0Ad54`](https://sepolia.etherscan.io/address/0x3D82488b4E9E5952f7B54853f649B2B292e0Ad54)

---

## Verify (optional)

```bash
# from /contracts
npx hardhat verify --network sepolia 0xAC7c0B74C9f6F753331a3DeeC8d40124Ac4f1FB0

npx hardhat verify --network sepolia \
  0x3D82488b4E9E5952f7B54853f649B2B292e0Ad54 \
  0xAC7c0B74C9f6F753331a3DeeC8d40124Ac4f1FB0 \
  1000 \
  604800 \
  0x16Fdb05c91058C087A0319230902F69B2B584088
```
