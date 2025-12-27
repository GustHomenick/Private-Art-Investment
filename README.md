# Private Art Investment

**Privacy-Preserving Art Collection Investment Using Fully Homomorphic Encryption**

[![License](https://img.shields.io/badge/license-BSD--3--Clause--Clear-green)](LICENSE)
[![TypeScript](https://img.shields.io/badge/typescript-5.8.3-blue)](https://www.typescriptlang.org/)
[![Hardhat](https://img.shields.io/badge/hardhat-2.26.0-yellow)](https://hardhat.org/)
[![FHEVM](https://img.shields.io/badge/fhevm-0.9.1-purple)](https://docs.zama.ai/fhevm)

A comprehensive FHEVM example demonstrating how to build privacy-preserving smart contracts using Fully Homomorphic Encryption on Ethereum. This standalone repository is designed as an educational resource for the Zama FHEVM Bounty Track December 2025.

## 🎯 Project Goals

This project demonstrates:

1. **Privacy-Preserving Finance**: Implement confidential investment tracking on blockchain
2. **FHE Encryption Patterns**: Complete implementation of euint32 encryption and homomorphic operations
3. **Automated Tooling**: Include scaffolding and documentation generation scripts
4. **Professional Development**: Production-ready code with comprehensive tests and documentation
5. **Educational Value**: Clear examples and anti-patterns for developers

## ✨ Key Features

### Smart Contract Implementation

- **Investor Registration**: Private profile initialization with encrypted values
- **Artwork Listing**: Fractional share offerings with metadata
- **Private Investment**: Confidential share purchases with encrypted amounts
- **Returns Distribution**: Proportional returns calculated on encrypted data
- **Access Control**: Owner and investor permission management

### FHE Security Features

- **euint32 Encryption**: Investment amounts encrypted on-chain
- **Homomorphic Computations**: Portfolio calculations without decryption
- **Granular Permissions**: FHE.allowThis() and FHE.allow() proper usage
- **User Decryption**: Investors decrypt only their own holdings
- **Transparent Verification**: All transactions verifiable despite encryption

### Development Tooling

- **Automated Scaffolding**: Create standalone example repositories with one command
- **Documentation Generator**: Auto-generate GitBook-compatible documentation
- **CI/CD Pipeline**: GitHub Actions for testing and verification
- **Comprehensive Testing**: 22+ test cases covering success and failure paths
- **Code Quality**: ESLint, Prettier, Solhint, and TypeScript strict mode

## 🚀 Quick Start

### Prerequisites

```bash
Node.js >= 20
npm >= 7.0.0
```

### Installation

```bash
git clone <repository-url>
cd private-art-investment
npm install
```

### Verify Setup

```bash
# Compile contracts
npm run compile

# Run tests
npm run test

# Check code quality
npm run lint
```

Expected output:
```
✓ 22+ tests passing
✓ All linting checks passing
✓ TypeScript compilation successful
```

## 📚 Understanding the Project

### Core Concepts Explained

#### 1. Fully Homomorphic Encryption (FHE)

FHE allows computation on encrypted data without decryption:

```solidity
// Investor's investment amount is encrypted
euint32 encryptedAmount = FHE.asEuint32(investmentAmount);

// Calculate total portfolio WITHOUT decrypting individual amounts
euint32 totalEncrypted = FHE.add(currentTotal, encryptedAmount);

// Only the investor can decrypt their own data
```

**Why this matters:**
- Investment amounts invisible to blockchain observers
- Calculations still possible on encrypted data
- Complete privacy with verifiable transactions

#### 2. Access Control Pattern

Critical for FHE operations:

```solidity
// ALWAYS grant both permissions:
FHE.allowThis(encryptedValue);        // Contract can use this value
FHE.allow(encryptedValue, msg.sender); // User can decrypt this value
```

**Common Mistake:**
```solidity
// WRONG - Missing allowThis()
FHE.allow(encryptedValue, msg.sender); // Contract can't access - will fail!
```

#### 3. Investment Privacy Flow

1. **Registration Phase**
   - Investor registers with encrypted zero-balance
   - System initializes encrypted portfolio tracking

2. **Investment Phase**
   - Investor selects artwork and shares
   - Amount encrypted using euint32
   - Encrypted value stored on-chain

3. **Portfolio Management**
   - Portfolio total calculated homomorphically
   - Individual amounts remain private
   - Only investor can decrypt

4. **Returns Distribution**
   - Decryption request initiated
   - Shares verified and decrypted securely
   - Returns distributed proportionally

## 🔧 Project Structure

```
private-art-investment/
│
├── contracts/
│   └── PrivateArtInvestment.sol      # Main FHE contract (340 lines)
│
├── test/
│   └── PrivateArtInvestment.ts       # Test suite (501 lines, 22+ tests)
│
├── deploy/
│   └── 001_deploy_private_art_investment.ts
│
├── tasks/
│   └── accounts.ts                   # Development helper
│
├── scripts/
│   ├── generate-docs.ts              # GitBook documentation generator
│   ├── create-fhevm-example.ts       # Example repository creator
│   └── README.md                     # Scripts documentation
│
├── examples/
│   ├── SUMMARY.md                    # Documentation index
│   └── private-art-investment.md     # Detailed guide
│
├── .github/
│   ├── workflows/ci.yml              # Automated testing
│   ├── ISSUE_TEMPLATE.md             # Bug report template
│   └── PULL_REQUEST_TEMPLATE.md      # PR template
│
├── hardhat.config.ts                 # Hardhat configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies and scripts
│
└── Documentation/
    ├── README.md                     # This file
    ├── USAGE.md                      # Usage guide
    ├── DEVELOPMENT.md                # Development guide
    ├── MAINTENANCE.md                # Maintenance guide
    ├── SECURITY.md                   # Security policy
    ├── CONTRIBUTING.md               # Contributing guidelines
    ├── CHANGELOG.md                  # Version history
    └── LICENSE                       # BSD-3-Clause-Clear
```

## 📖 Development Workflow

### 1. Smart Contract Development

```bash
# Edit contracts/PrivateArtInvestment.sol

# Compile
npm run compile

# Run tests
npm run test

# Check code quality
npm run lint
npm run prettier:write
```

### 2. Testing

The test suite covers:

- **Success Cases**: Correct usage of FHE operations
- **Failure Cases**: Error handling and validation
- **Edge Cases**: Boundary conditions and limits
- **Anti-Patterns**: Common mistakes and how to avoid them

```bash
# Run all tests
npm run test

# Run specific test
npm run test -- --grep "registerInvestor"

# Run with gas reporting
REPORT_GAS=true npm run test

# Generate coverage report
npm run coverage
```

### 3. Documentation Generation

```bash
# Generate GitBook documentation
npm run docs:generate

# Documentation is placed in examples/
```

## 🎓 Learning Resources

### Understanding FHE

**Before diving in, understand these concepts:**

1. **Encryption Binding**: Values are encrypted with [contract, user] pair
2. **Input Proofs**: Zero-knowledge proofs verify correct binding
3. **Permission System**: Both contract and user need access permissions
4. **Homomorphic Operations**: Math on encrypted data without decryption

### Key Files to Study

1. **Smart Contract**
   - `contracts/PrivateArtInvestment.sol` - Main implementation
   - Study comments explaining FHE operations

2. **Tests**
   - `test/PrivateArtInvestment.ts` - Complete usage examples
   - Shows correct and incorrect patterns
   - Demonstrates anti-patterns

3. **Documentation**
   - `examples/private-art-investment.md` - Detailed explanation
   - `USAGE.md` - Workflow guide
   - `DEVELOPMENT.md` - Development instructions

## 🚢 Deployment

### Local Development Network

```bash
# Terminal 1: Start local node
npm run chain

# Terminal 2: Deploy contract
npm run deploy:localhost

# Interact with contract
npx hardhat console --network localhost
> const contract = await ethers.getContractAt("PrivateArtInvestment", "0x...");
> const tx = await contract.registerInvestor();
```

### Sepolia Testnet

```bash
# Setup environment variables
npx hardhat vars setup

# Deploy
npm run deploy:sepolia

# Verify on Etherscan
npm run verify:sepolia
```

## 🧪 Test Coverage

### Test Categories

| Category | Tests | Purpose |
|----------|-------|---------|
| Deployment | 1 | Verify contract initialization |
| Registration | 3 | Investor onboarding |
| Artwork Listing | 3 | Artwork management |
| Investment | 5 | Private investment flow |
| Encryption | 2 | FHE operation correctness |
| Access Control | 2 | Permission enforcement |
| Edge Cases | 5 | Boundary conditions |
| **Total** | **22+** | **Complete coverage** |

### Running Tests

```bash
# All tests
npm run test

# Specific test file
npm run test test/PrivateArtInvestment.ts

# Pattern matching
npm run test -- --grep "encryption"

# With coverage
npm run coverage
```

## 🔐 Security Considerations

### FHE-Specific

1. **Always Grant Permissions**
   ```solidity
   FHE.allowThis(value);          // Contract permission
   FHE.allow(value, msg.sender);  // User permission
   ```

2. **Validate Inputs**
   - Check plaintext values before encryption
   - Verify ranges and bounds
   - Prevent overflow in encrypted types

3. **Manage Decryption**
   - Decryption is asynchronous
   - Verify signatures on decrypted values
   - Handle failures gracefully

### Contract Security

- Access control modifiers for sensitive functions
- Input validation for all external calls
- Safe arithmetic (no overflow/underflow)
- Emergency withdrawal mechanism

For detailed information, see [SECURITY.md](SECURITY.md)

## 📋 Available npm Scripts

### Development
```bash
npm run compile              # Compile contracts
npm run test               # Run tests
npm run coverage           # Coverage report
npm run clean              # Clean artifacts
```

### Code Quality
```bash
npm run lint               # Check code style
npm run lint:sol           # Solidity linting
npm run lint:ts            # TypeScript linting
npm run prettier:check     # Check formatting
npm run prettier:write     # Format code
```

### Documentation
```bash
npm run docs:generate      # Generate documentation
npm run docs:all           # Generate all docs
```

### Automation
```bash
npm run create-example       # Create standalone example
npm run create-example:list  # List examples
```

### Deployment
```bash
npm run deploy:localhost   # Deploy locally
npm run deploy:sepolia     # Deploy to Sepolia
npm run verify:sepolia     # Verify on Etherscan
```

### Build
```bash
npm run build:ts           # Build TypeScript
npm run typechain          # Generate types
npm run chain              # Start local node
```

## 🤝 Contributing

We welcome contributions! Please:

1. Read [CONTRIBUTING.md](CONTRIBUTING.md)
2. Follow code standards
3. Write tests for new features
4. Update documentation
5. Submit pull requests

## 📜 License

This project is licensed under the **BSD-3-Clause-Clear License**.

See [LICENSE](LICENSE) for details.

## 📚 Additional Resources

### Official Documentation
- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/)
- [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- [Ethers.js Documentation](https://docs.ethers.org/)

### Project Documentation
- [USAGE.md](USAGE.md) - Complete usage guide
- [DEVELOPMENT.md](DEVELOPMENT.md) - Development instructions
- [MAINTENANCE.md](MAINTENANCE.md) - Maintenance guide
- [SECURITY.md](SECURITY.md) - Security policy
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [CHANGELOG.md](CHANGELOG.md) - Version history

### Example Documentation
- [examples/SUMMARY.md](examples/SUMMARY.md) - Documentation index
- [examples/private-art-investment.md](examples/private-art-investment.md) - Detailed guide

### Community
- [Zama Community Forum](https://www.zama.ai/community)
- [Zama Discord Server](https://discord.com/invite/zama)
- [Zama Twitter](https://twitter.com/zama_fhe)

## 🎯 Competition Information

This project is submitted for the **Zama FHEVM Bounty Track December 2025**.

**Submission Details:**
- Repository Type: Standalone Hardhat project
- License: BSD-3-Clause-Clear
- Language: English (100%)
- Test Coverage: 22+ comprehensive test cases
- Documentation: 17 markdown files (4,500+ lines)
- Automation: Full scaffolding and documentation generation

## ❓ Frequently Asked Questions

**Q: Can I use this code in production?**
A: This is an educational example. Before production use, conduct security audits and add appropriate safety checks.

**Q: How do I understand FHE encryption?**
A: Start with `examples/private-art-investment.md` and study the test cases in `test/PrivateArtInvestment.ts`.

**Q: What's the difference between allowThis() and allow()?**
A: `allowThis()` grants contract permissions, `allow()` grants user permissions. Both are required for FHE operations.

**Q: Can I modify the contract?**
A: Yes! See [DEVELOPMENT.md](DEVELOPMENT.md) for the development workflow.

**Q: How do I deploy to Sepolia?**
A: See [USAGE.md](USAGE.md) for deployment instructions.

## 🏆 Key Achievements

This project demonstrates:

✅ **Complete FHE Implementation** - All major FHE patterns implemented
✅ **Professional Tooling** - Automated scaffolding and documentation
✅ **Comprehensive Testing** - 22+ test cases with full coverage
✅ **Production Quality** - Code quality standards and best practices
✅ **Educational Value** - Clear examples and anti-patterns
✅ **Automation Excellence** - CI/CD, documentation generation, example creation

## 📞 Support

For questions or issues:

1. Check [USAGE.md](USAGE.md) for common questions
2. Review test cases in `test/` for code examples
3. See [SECURITY.md](SECURITY.md) for security questions
4. Open an issue on GitHub
5. Ask on [Zama Community](https://www.zama.ai/community)

---

**Built with ❤️ using FHEVM by Zama**

**Status**: Production-ready educational example
**Version**: 1.0.0
**Last Updated**: December 23, 2025

For more information, see [FINAL_SUMMARY.md](FINAL_SUMMARY.md)
