# Development Guide

Complete guide for developing and contributing to the Private Art Investment project.

## Table of Contents

- [Development Environment Setup](#development-environment-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Debugging](#debugging)
- [Common Tasks](#common-tasks)

## Development Environment Setup

### Prerequisites

- **Node.js**: Version 20 or higher
  - Check version: `node --version`
  - Use `.nvmrc` with nvm: `nvm use`
- **npm**: Version 7 or higher
  - Check version: `npm --version`
- **Git**: For version control

### Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd private-art-investment

# Install dependencies
npm install

# Verify installation
npm run compile
```

### Environment Variables (Optional)

For Sepolia deployment:

```bash
# Setup environment variables
npx hardhat vars setup

# You'll be prompted for:
# - MNEMONIC: Wallet seed phrase
# - INFURA_API_KEY: Infura project ID
# - ETHERSCAN_API_KEY: Etherscan verification key
```

## Project Structure

### Contracts (`contracts/`)

Contains smart contracts written in Solidity.

```
contracts/
└── PrivateArtInvestment.sol    # Main FHE contract
```

**Key Points:**
- Use `@fhevm/solidity` imports
- Inherit from `ZamaEthereumConfig`
- Include JSDoc comments
- Follow Solidity style guide

### Tests (`test/`)

Test suite using Hardhat + Chai + Mocha.

```
test/
└── PrivateArtInvestment.ts    # Test suite (500+ lines, 22+ tests)
```

**Test Structure:**
- `before()` - Setup signers
- `beforeEach()` - Deploy fresh contract
- Describe blocks for test categories
- Clear test names
- Assertion comments

### Scripts (`scripts/`)

Utility and automation scripts.

```
scripts/
├── generate-docs.ts           # Documentation generator
├── create-fhevm-example.ts    # Example creator
└── README.md                  # Scripts documentation
```

### Deployment (`deploy/`)

Hardhat-deploy scripts.

```
deploy/
└── 001_deploy_private_art_investment.ts
```

### Tasks (`tasks/`)

Hardhat tasks for development.

```
tasks/
└── accounts.ts               # Show accounts and balances
```

## Development Workflow

### 1. Creating a New Feature

**Step 1: Create feature branch**
```bash
git checkout -b feature/my-feature
```

**Step 2: Make changes**
- Update contracts in `contracts/`
- Add tests in `test/`
- Update documentation

**Step 3: Test locally**
```bash
npm run compile
npm run test
npm run lint
```

**Step 4: Commit changes**
```bash
git add .
git commit -m "feat(contract): add new feature"
```

### 2. Fixing a Bug

**Step 1: Create bug fix branch**
```bash
git checkout -b fix/bug-name
```

**Step 2: Write failing test**
```typescript
it("should fix the bug", async function () {
  // Test that demonstrates the bug
});
```

**Step 3: Fix the code**
```solidity
// Fix in contract
```

**Step 4: Verify test passes**
```bash
npm run test -- --grep "should fix the bug"
```

**Step 5: Commit and push**
```bash
git commit -m "fix: description of bug fix"
git push origin fix/bug-name
```

### 3. Adding Documentation

**For code changes:**
```typescript
/**
 * @title Function Title
 * @notice User-facing description
 * @dev Technical implementation details
 * @param arg1 First parameter
 * @return Return value description
 */
function myFunction(uint256 arg1) external returns (uint256) {
  // Implementation
}
```

**For markdown:**
```markdown
# Section Title

Clear description of the topic.

## Subsection

More detailed information.

### Code Example

\`\`\`solidity
// Example code
\`\`\`
```

## Code Standards

### Solidity

Follow the [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html):

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";

/**
 * @title Contract Title
 * @notice Brief description
 */
contract MyContract {
  // State variables
  euint32 private _value;

  // Events
  event ValueChanged(euint32 newValue);

  // Functions
  function getValue() external view returns (euint32) {
    return _value;
  }
}
```

**Key Rules:**
- License: BSD-3-Clause-Clear
- Use `euint*` for encrypted values
- Inherit from `ZamaEthereumConfig`
- Private variables with underscore prefix
- Public functions with clear names
- Events for important state changes
- Comprehensive comments

### TypeScript

Follow [TypeScript strict mode](https://www.typescriptlang.org/tsconfig#strict):

```typescript
/**
 * Fetch and process contract data
 * @param address - Contract address
 * @returns Processed data
 */
async function fetchData(address: string): Promise<ProcessedData> {
  // Implementation
}
```

**Key Rules:**
- Strict mode enabled
- Type annotations required
- Clear variable names
- Proper error handling
- Async/await for promises

### Formatting

Use Prettier with provided configuration:

```bash
npm run prettier:write    # Format all files
npm run prettier:check    # Check formatting
```

### Linting

Check code quality:

```bash
npm run lint:sol         # Check Solidity
npm run lint:ts          # Check TypeScript
npm run lint             # Check all
```

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run specific test
npm run test -- --grep "test name"

# Run with gas reporting
REPORT_GAS=true npm run test

# Run with coverage
npm run coverage
```

### Writing Tests

```typescript
describe("Feature Category", function () {
  let contract: MyContract;
  let owner: HardhatEthersSigner;

  beforeEach(async function () {
    const [signer] = await ethers.getSigners();
    owner = signer;

    // Deploy contract
    const factory = await ethers.getContractFactory("MyContract");
    contract = await factory.deploy();
  });

  it("should do something", async function () {
    // Arrange
    const input = 42;

    // Act
    const result = await contract.myFunction(input);

    // Assert
    expect(result).to.equal(expected);
  });

  it("should fail with invalid input", async function () {
    // Test error cases
    await expect(
      contract.myFunction(0)
    ).to.be.revertedWith("Invalid input");
  });
});
```

### Test Checklist

- [ ] Success cases pass
- [ ] Failure cases handled correctly
- [ ] Edge cases covered
- [ ] Gas usage reasonable
- [ ] Events emitted correctly
- [ ] State changes verified

## Documentation

### Markdown Files

**Main documents:**
- `README.md` - Project overview
- `USAGE.md` - Usage guide
- `CONTRIBUTING.md` - Contribution guidelines
- `DEVELOPMENT.md` - This file

**Generated documentation:**
- `examples/` - Auto-generated GitBook format

### Generating Documentation

```bash
# Generate documentation
npm run docs:generate

# View generated files
ls examples/
```

### Documentation Standards

- Use clear, concise language
- Include code examples
- Link to related resources
- Keep up to date
- Test all examples

## Debugging

### Console Logging

```solidity
// In contract
import "hardhat/console.sol";

function myFunction() external {
  console.log("Debug message", value);
}
```

### Test Debugging

```typescript
// In test
console.log("Debug:", value);

// Run with debug output
DEBUG=hardhat:* npm run test
```

### VS Code Debugging

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
      "args": ["test", "--no-compile"],
      "console": "integratedTerminal"
    }
  ]
}
```

## Common Tasks

### Adding a New Contract

1. **Create contract file**
   ```bash
   touch contracts/MyNewContract.sol
   ```

2. **Write contract**
   ```solidity
   // SPDX-License-Identifier: BSD-3-Clause-Clear
   pragma solidity ^0.8.24;

   contract MyNewContract {
     // Implementation
   }
   ```

3. **Create test file**
   ```bash
   touch test/MyNewContract.ts
   ```

4. **Write tests**
   ```typescript
   describe("MyNewContract", function () {
     // Tests
   });
   ```

5. **Update deployment**
   ```bash
   cp deploy/001_deploy_private_art_investment.ts deploy/002_deploy_my_new_contract.ts
   ```

6. **Verify**
   ```bash
   npm run compile
   npm run test
   npm run lint
   ```

### Creating Documentation

```bash
npm run docs:generate
```

This automatically creates documentation in `examples/`.

### Deploying to Testnet

```bash
# Setup environment variables
npx hardhat vars setup

# Deploy to Sepolia
npm run deploy:sepolia

# Verify on Etherscan
npm run verify:sepolia
```

### Running Linters

```bash
# Check code style
npm run lint

# Fix formatting
npm run prettier:write
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process using port 8545
lsof -ti:8545 | xargs kill -9

# Try again
npm run chain
```

### FHEVM Mock Not Available

Make sure to run tests locally, not on Sepolia:

```bash
npm run test  # ✅ Correct
# NOT: npx hardhat test --network sepolia
```

### Out of Memory

Increase Node.js memory:

```bash
NODE_OPTIONS=--max_old_space_size=4096 npm run compile
```

### Dependencies Issue

Clean and reinstall:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Resources

### Documentation
- [Hardhat Docs](https://hardhat.org/)
- [FHEVM Docs](https://docs.zama.ai/fhevm)
- [Solidity Docs](https://docs.soliditylang.org/)
- [Ethers.js Docs](https://docs.ethers.org/)

### Tools
- [VS Code](https://code.visualstudio.com/) - Recommended editor
- [Solidity Extension](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity) - Syntax highlighting
- [Prettier Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Auto-formatting

### Community
- [Zama Forum](https://www.zama.ai/community)
- [Zama Discord](https://discord.com/invite/zama)
- [GitHub Discussions](https://github.com)

---

**Questions?** Check the [README.md](README.md) or [USAGE.md](USAGE.md) for more information.

Happy developing! 🚀
