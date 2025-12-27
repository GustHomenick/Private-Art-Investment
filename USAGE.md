# Usage Guide

Complete guide for using the Private Art Investment project.

## Prerequisites

- **Node.js**: Version 20 or higher
- **npm**: Version 7 or higher
- **Git**: For version control

## Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd private-art-investment
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages:
- Hardhat and plugins
- FHEVM libraries
- Testing frameworks
- Development tools

### Step 3: Setup Environment Variables (Optional)

For Sepolia deployment:

```bash
npx hardhat vars setup
```

This will prompt you to configure:
- Mnemonic (wallet seed phrase)
- Infura API key
- Etherscan API key

## Development Workflow

### Compiling Contracts

```bash
npm run compile
```

Output:
- Compiled contracts in `artifacts/`
- TypeChain types in `types/`

### Running Tests

```bash
# Run all tests
npm run test

# Run tests with gas reporting
REPORT_GAS=true npm run test

# Run tests with coverage report
npm run coverage
```

### Code Quality

```bash
# Check code style
npm run lint

# Fix formatting
npm run prettier:write

# Check formatting only
npm run prettier:check
```

### Generating Documentation

```bash
# Generate documentation
npm run docs:generate

# View generated docs in examples/ directory
```

## Deployment

### Local Network

```bash
# Start local Hardhat node
npm run chain

# In another terminal, deploy
npm run deploy:localhost

# You should see deployment output with contract address
```

### Sepolia Testnet

```bash
# Deploy to Sepolia
npm run deploy:sepolia

# Verify on Etherscan
npm run verify:sepolia
```

## Interacting with Contract

### Via Hardhat Console

```bash
npx hardhat console --network localhost

# In the console:
> const contract = await ethers.getContractAt("PrivateArtInvestment", "0x...");
> const tx = await contract.registerInvestor();
> await tx.wait();
```

### Via Scripts

Create a script in the `scripts/` directory:

```typescript
// scripts/interact.ts
import { ethers } from "hardhat";

async function main() {
  const contract = await ethers.getContractAt(
    "PrivateArtInvestment",
    "0xContractAddress"
  );

  // Register as investor
  const tx = await contract.registerInvestor();
  await tx.wait();

  console.log("Investor registered!");
}

main().catch(console.error);
```

Run with:

```bash
npx hardhat run scripts/interact.ts --network localhost
```

## Testing

### Understanding Tests

Tests are in `test/PrivateArtInvestment.ts` and cover:

1. **Deployment Tests**
   - Contract initialization
   - Initial state verification

2. **Investor Registration**
   - Successful registration
   - Duplicate registration prevention
   - Multiple investors

3. **Artwork Listing**
   - Owner listings
   - Non-owner rejection
   - Value validation

4. **Investment Flow**
   - Private investment creation
   - Encrypted amount handling
   - Share tracking

5. **Edge Cases**
   - Insufficient payment
   - Invalid artwork
   - Over-investment

### Running Specific Tests

```bash
# Run tests matching a pattern
npx hardhat test --grep "registerInvestor"

# Run a specific test file
npx hardhat test test/PrivateArtInvestment.ts
```

### Test Output

Successful test run shows:
- ✓ Test name
- Test count and duration
- Gas usage (with REPORT_GAS=true)

## Debugging

### Enable Debug Logging

```bash
# Run tests with debug output
DEBUG=hardhat:* npm run test
```

### Using VS Code Debugger

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Hardhat Tests",
      "program": "${workspaceFolder}/node_modules/.bin/hardhat",
      "args": ["test"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Console Debugging

Add logs to contract or tests:

```solidity
// In contract
console.log("Value:", value);

// In test
console.log("Contract address:", contractAddress);
```

## Configuration

### Network Configuration

Edit `hardhat.config.ts`:

```typescript
networks: {
  localhost: {
    url: "http://127.0.0.1:8545",
  },
  sepolia: {
    url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
    accounts: {
      mnemonic: MNEMONIC,
    },
  },
}
```

### Compiler Configuration

Edit `hardhat.config.ts` solidity section:

```typescript
solidity: {
  version: "0.8.27",
  settings: {
    optimizer: {
      enabled: true,
      runs: 800,
    },
  },
}
```

## Troubleshooting

### Issue: "FHEVM mock environment not found"

**Solution**: Tests must run on mock FHEVM environment
```bash
# Correct - uses mock FHEVM
npm run test

# Incorrect - Sepolia doesn't have mock FHEVM
npx hardhat test --network sepolia
```

### Issue: "Insufficient permission for value"

**Solution**: Always grant both permissions:
```solidity
FHE.allowThis(value);        // Contract permission
FHE.allow(value, msg.sender); // User permission
```

### Issue: "Out of memory during compilation"

**Solution**: Increase Node.js memory:
```bash
NODE_OPTIONS=--max_old_space_size=4096 npm run compile
```

### Issue: npm install fails

**Solution**: Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## Best Practices

### 1. Always Test Locally First

```bash
npm run compile
npm run test
npm run lint
```

### 2. Use Named Accounts

```typescript
const { deployer, alice } = await getNamedAccounts();
```

### 3. Handle Errors Properly

```typescript
try {
  await contract.operation();
} catch (error) {
  console.error("Operation failed:", error);
}
```

### 4. Use Gas Estimates

```typescript
const gasEstimate = await contract.operation.estimateGas();
console.log("Gas needed:", gasEstimate.toString());
```

### 5. Verify Transactions

```typescript
const tx = await contract.operation();
const receipt = await tx.wait();
console.log("Confirmed at block:", receipt.blockNumber);
```

## Project Structure

```
private-art-investment/
├── contracts/              # Smart contracts
├── test/                   # Test suite
├── deploy/                 # Deployment scripts
├── tasks/                  # Hardhat tasks
├── scripts/                # Utility scripts
├── examples/               # Generated documentation
├── artifacts/              # Compiled contracts (gitignored)
├── types/                  # TypeChain types (gitignored)
├── hardhat.config.ts       # Hardhat configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies
└── README.md               # Main documentation
```

## Getting Help

1. **Read Documentation**
   - `README.md` - Project overview
   - `examples/` - Usage examples
   - Code comments - Implementation details

2. **Check Tests**
   - `test/PrivateArtInvestment.ts` - Usage patterns
   - Both success and failure cases

3. **External Resources**
   - [FHEVM Docs](https://docs.zama.ai/fhevm)
   - [Hardhat Docs](https://hardhat.org/)
   - [Solidity Docs](https://docs.soliditylang.org/)

4. **Community Support**
   - [Zama Forum](https://www.zama.ai/community)
   - [Discord](https://discord.com/invite/zama)

## Next Steps

1. Read `README.md` for project overview
2. Review `examples/` for detailed documentation
3. Run `npm run test` to see examples in action
4. Experiment with local deployment
5. Modify contract and test your changes
6. Deploy to Sepolia testnet

---

Happy building with FHE! 🔐
