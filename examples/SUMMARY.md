# Private Art Investment - FHEVM Example

## Documentation Index

### Advanced Examples

- [Private Art Investment](private-art-investment.md)

## Overview

This repository demonstrates how to build privacy-preserving smart contracts using Fully Homomorphic Encryption (FHE) on Ethereum. The example showcases a real-world use case: confidential art investment.

## Key Features

- **FHE Encryption**: Investment amounts encrypted using euint32 types
- **Homomorphic Operations**: Computing portfolio values on encrypted data
- **Access Control**: Proper use of FHE permission system (allowThis, allow)
- **User Decryption**: Investors decrypting their own encrypted holdings
- **Smart Contract Patterns**: Best practices for FHEVM development

## Quick Start

```bash
# Clone and install
git clone <repository-url>
cd private-art-investment
npm install

# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy locally
npm run deploy:localhost
```

## Learning Path

### 1. Start Here
- Read the [Private Art Investment](private-art-investment.md) documentation
- Review the contract code in `contracts/PrivateArtInvestment.sol`
- Study the test cases in `test/PrivateArtInvestment.ts`

### 2. Key Concepts

#### FHE Encryption
Learn how to encrypt values on-chain:
```solidity
euint32 encrypted = FHE.asEuint32(value);
```

#### Access Control
Understand the permission system:
```solidity
FHE.allowThis(encrypted);        // Contract permission
FHE.allow(encrypted, msg.sender); // User permission
```

#### Homomorphic Operations
Perform computations on encrypted data:
```solidity
euint32 sum = FHE.add(encrypted1, encrypted2);
```

#### User Decryption
Decrypt values with proper permissions:
```typescript
const decrypted = await fhevm.userDecryptEuint(
  FhevmType.euint32,
  encryptedValue,
  contractAddress,
  signer
);
```

### 3. Anti-Patterns to Avoid

❌ **Missing allowThis()**
```solidity
// WRONG - contract can't access the value
FHE.allow(value, msg.sender);
```

✅ **Correct pattern**
```solidity
FHE.allowThis(value);
FHE.allow(value, msg.sender);
```

❌ **View functions with encrypted returns**
```solidity
// WRONG - can't return encrypted from view
function getValue() public view returns (euint32) {
    return _encrypted;
}
```

❌ **Signer mismatch**
```typescript
// WRONG - Alice encrypts, Bob tries to submit
const enc = await fhevm.createEncryptedInput(contract, alice.address)
    .add32(123).encrypt();
await contract.connect(bob).operation(enc);  // Fails!
```

## Project Structure

```
private-art-investment/
├── contracts/
│   └── PrivateArtInvestment.sol    # Main FHE contract
├── test/
│   └── PrivateArtInvestment.ts     # Comprehensive tests
├── deploy/
│   └── 001_deploy_private_art_investment.ts
├── tasks/
│   └── accounts.ts
├── examples/                        # This documentation
│   ├── SUMMARY.md
│   └── private-art-investment.md
├── scripts/
│   └── generate-docs.ts             # Documentation generator
└── README.md
```

## Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm run test

# Run with coverage
npm run coverage

# Run with gas reporting
REPORT_GAS=true npm run test
```

## Deployment

Deploy to different networks:

```bash
# Local network
npm run deploy:localhost

# Sepolia testnet
npm run deploy:sepolia

# Verify on Etherscan
npm run verify:sepolia
```

## Resources

### Official Documentation
- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/)
- [Solidity Documentation](https://docs.soliditylang.org/)

### Related Examples
- [Base Hardhat Template](https://github.com/zama-ai/fhevm-hardhat-template)
- [FHEVM Examples](https://github.com/zama-ai/fhevm)
- [OpenZeppelin Confidential Contracts](https://github.com/OpenZeppelin/openzeppelin-confidential-contracts)

### Community
- [Zama Community Forum](https://www.zama.ai/community)
- [Zama Discord](https://discord.com/invite/zama)
- [Zama Twitter](https://twitter.com/zama_fhe)

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## License

BSD-3-Clause-Clear - See [LICENSE](../LICENSE) file for details.

---

**Built with ❤️ using FHEVM by Zama**
