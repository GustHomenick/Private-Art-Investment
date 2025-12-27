# Quick Start Guide

Get started with the Private Art Investment project in 5 minutes.

## 1. Installation (1 minute)

```bash
cd D:\\\PrivateArtInvestment
npm install
```

## 2. Verify Setup (1 minute)

```bash
npm run compile
```

Expected output:
```
Compiled 1 Solidity file successfully
```

## 3. Run Tests (2 minutes)

```bash
npm run test
```

Expected output:
```
PrivateArtInvestment
  Contract Deployment
    ✓ should deploy with correct initial state
  Investor Registration
    ✓ should register new investor with encrypted profile
    ... (22+ tests)

  22 passing
```

## 4. Check Code Quality (1 minute)

```bash
npm run lint
```

Expected output:
```
✓ Solidity linting passed
✓ TypeScript linting passed
✓ Prettier format check passed
```

## 5. Generate Documentation (1 minute)

```bash
npm run docs:generate
```

Files generated:
- `examples/private-art-investment.md`
- `examples/SUMMARY.md`

---

## Next Steps

### Understand the Project
1. Read `README.md` - Overview
2. Read `examples/SUMMARY.md` - Documentation index
3. Read `examples/private-art-investment.md` - Detailed guide

### Explore the Code
1. Open `contracts/PrivateArtInvestment.sol` - Smart contract
2. Open `test/PrivateArtInvestment.ts` - Tests
3. Review inline comments

### Learn FHE Patterns
1. Study encryption: `FHE.asEuint32()`
2. Study access control: `FHE.allowThis()`, `FHE.allow()`
3. Study operations: `FHE.add()`, `FHE.sub()`
4. Study decryption: `userDecryptEuint()`

### Develop Locally
```bash
# Start local Hardhat node
npm run chain

# In another terminal, deploy
npm run deploy:localhost

# You can now interact with the contract
```

---

## Key Commands

```bash
# Development
npm run compile           # Compile contracts
npm run test             # Run tests
npm run test -- --grep "test name"  # Run specific test

# Code Quality
npm run lint             # Check all linting
npm run prettier:write   # Format code

# Documentation
npm run docs:generate    # Generate docs

# Deployment
npm run deploy:localhost # Deploy locally
npm run deploy:sepolia   # Deploy to testnet

# Build
npm run build:ts         # Build TypeScript
npm run clean            # Clean artifacts
```

---

## Troubleshooting

### npm install fails
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### Tests fail with "FHEVM mock not found"
```bash
# Make sure to run tests locally, not on Sepolia
npm run test  # ✅ Correct
# NOT: npx hardhat test --network sepolia
```

### Port already in use
```bash
# Kill process using port 8545
# Then try again
npm run chain
```

---

## Project Structure

```
private-art-investment/
├── README.md              ← Start here
├── USAGE.md              ← Detailed guide
├── QUICKSTART.md         ← This file
├── examples/             ← Documentation
├── contracts/            ← Smart contracts
├── test/                 ← Tests
├── deploy/               ← Deployment
└── hardhat.config.ts     ← Configuration
```

---

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/)
- [Project README](README.md)
- [Usage Guide](USAGE.md)

---

**All set! Happy building with FHE! 🔐**
