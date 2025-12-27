/**
 * @title FHEVM Example Creator
 * @notice Creates standalone FHEVM example repositories from the base template
 * @dev This script automates the creation of new FHEVM examples by cloning the base template
 *      and customizing it with specific contract and test files
 */

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

/**
 * Configuration for available examples
 * Each example includes contract path, test path, and metadata
 */
interface ExampleConfig {
  name: string;
  title: string;
  description: string;
  contractFile: string;
  testFile: string;
  category: string;
}

const EXAMPLES: Record<string, ExampleConfig> = {
  "private-art-investment": {
    name: "private-art-investment",
    title: "Private Art Investment",
    description: "Privacy-preserving art collection investment using FHE encryption",
    contractFile: "contracts/PrivateArtInvestment.sol",
    testFile: "test/PrivateArtInvestment.ts",
    category: "advanced",
  },
};

/**
 * Creates a standalone FHEVM example repository
 * @param exampleName - Name of the example to create
 * @param outputPath - Destination path for the new repository
 */
async function createExample(exampleName: string, outputPath: string): Promise<void> {
  console.log(`\n🚀 Creating FHEVM example: ${exampleName}\n`);

  // Validate example exists
  const example = EXAMPLES[exampleName];
  if (!example) {
    console.error(`❌ Error: Example "${exampleName}" not found`);
    console.log("\nAvailable examples:");
    Object.keys(EXAMPLES).forEach((key) => {
      console.log(`  - ${key}: ${EXAMPLES[key].description}`);
    });
    process.exit(1);
  }

  // Create output directory
  const baseDir = process.cwd();
  const fullOutputPath = path.resolve(outputPath);

  if (fs.existsSync(fullOutputPath)) {
    console.error(`❌ Error: Directory already exists: ${fullOutputPath}`);
    process.exit(1);
  }

  console.log(`📁 Creating directory: ${fullOutputPath}`);
  fs.mkdirSync(fullOutputPath, { recursive: true });

  // Copy base template structure
  console.log("📋 Copying base template...");
  copyBaseTemplate(baseDir, fullOutputPath);

  // Copy contract file
  console.log(`📄 Copying contract: ${example.contractFile}`);
  const contractSource = path.join(baseDir, example.contractFile);
  const contractDest = path.join(fullOutputPath, "contracts", path.basename(example.contractFile));

  if (!fs.existsSync(contractSource)) {
    console.error(`❌ Error: Contract file not found: ${contractSource}`);
    process.exit(1);
  }

  fs.copyFileSync(contractSource, contractDest);

  // Copy test file
  console.log(`🧪 Copying test: ${example.testFile}`);
  const testSource = path.join(baseDir, example.testFile);
  const testDest = path.join(fullOutputPath, "test", path.basename(example.testFile));

  if (!fs.existsSync(testSource)) {
    console.error(`❌ Error: Test file not found: ${testSource}`);
    process.exit(1);
  }

  fs.copyFileSync(testSource, testDest);

  // Generate README
  console.log("📝 Generating README.md...");
  generateReadme(example, fullOutputPath);

  // Update package.json
  console.log("📦 Updating package.json...");
  updatePackageJson(example, fullOutputPath);

  // Generate deployment script
  console.log("🚀 Generating deployment script...");
  generateDeploymentScript(example, fullOutputPath);

  console.log("\n✅ Example created successfully!");
  console.log(`\n📍 Location: ${fullOutputPath}`);
  console.log("\n🎯 Next steps:");
  console.log(`  cd ${outputPath}`);
  console.log("  npm install");
  console.log("  npm run compile");
  console.log("  npm run test");
  console.log("\n");
}

/**
 * Copies the base template structure
 */
function copyBaseTemplate(baseDir: string, outputPath: string): void {
  // Create directory structure
  const directories = ["contracts", "test", "deploy", "tasks", "scripts"];

  directories.forEach((dir) => {
    const dirPath = path.join(outputPath, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });

  // Copy configuration files
  const configFiles = [
    "hardhat.config.ts",
    "tsconfig.json",
    ".eslintrc.yml",
    ".prettierrc.yml",
    ".gitignore",
    ".solhint.json",
    ".solcover.js",
    "LICENSE",
  ];

  configFiles.forEach((file) => {
    const source = path.join(baseDir, file);
    const dest = path.join(outputPath, file);

    if (fs.existsSync(source)) {
      fs.copyFileSync(source, dest);
    }
  });

  // Copy tasks
  const tasksDir = path.join(baseDir, "tasks");
  if (fs.existsSync(tasksDir)) {
    const taskFiles = fs.readdirSync(tasksDir);
    taskFiles.forEach((file) => {
      const source = path.join(tasksDir, file);
      const dest = path.join(outputPath, "tasks", file);
      fs.copyFileSync(source, dest);
    });
  }
}

/**
 * Generates README.md for the example
 */
function generateReadme(example: ExampleConfig, outputPath: string): void {
  const readme = `# ${example.title}

${example.description}

## Overview

This is a standalone FHEVM example demonstrating privacy-preserving smart contracts using Fully Homomorphic Encryption (FHE).

## Prerequisites

- Node.js >= 20
- npm >= 7.0.0

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

### Compile Contracts

\`\`\`bash
npm run compile
\`\`\`

### Run Tests

\`\`\`bash
npm run test
\`\`\`

### Deploy

\`\`\`bash
# Local network
npm run deploy:localhost

# Sepolia testnet
npm run deploy:sepolia
\`\`\`

## Project Structure

\`\`\`
${example.name}/
├── contracts/          # Smart contracts
├── test/              # Test suite
├── deploy/            # Deployment scripts
├── tasks/             # Hardhat tasks
├── hardhat.config.ts  # Configuration
└── README.md          # This file
\`\`\`

## Key Concepts

This example demonstrates:

- **FHE Encryption**: Encrypting values using euint32 types
- **Access Control**: Proper use of FHE.allowThis() and FHE.allow()
- **Homomorphic Operations**: Computing on encrypted data
- **User Decryption**: Decrypting values with proper permissions

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/)
- [Solidity Documentation](https://docs.soliditylang.org/)

## License

BSD-3-Clause-Clear

---

**Built with FHEVM by Zama**
`;

  fs.writeFileSync(path.join(outputPath, "README.md"), readme);
}

/**
 * Updates package.json with example-specific information
 */
function updatePackageJson(example: ExampleConfig, outputPath: string): void {
  const packageJson = {
    name: example.name,
    description: example.description,
    version: "1.0.0",
    engines: {
      node: ">=20",
      npm: ">=7.0.0",
    },
    license: "BSD-3-Clause-Clear",
    keywords: ["fhevm", "zama", "ethereum", "privacy", "homomorphic-encryption", "solidity", "hardhat"],
    scripts: {
      clean: "rimraf ./fhevmTemp ./artifacts ./cache ./coverage ./types ./coverage.json ./dist && npm run typechain",
      compile: "cross-env TS_NODE_TRANSPILE_ONLY=true hardhat compile",
      coverage:
        'cross-env SOLIDITY_COVERAGE=true hardhat coverage --solcoverjs ./.solcover.js --temp artifacts --testfiles "test/**/*.ts" && npm run typechain',
      lint: "npm run lint:sol && npm run lint:ts && npm run prettier:check",
      "lint:sol": 'solhint --max-warnings 0 "contracts/**/*.sol"',
      "lint:ts": "eslint --ignore-path ./.eslintignore --ext .js,.ts .",
      postcompile: "npm run typechain",
      "prettier:check": 'prettier --check "**/*.{js,json,md,sol,ts,yml}"',
      "prettier:write": 'prettier --write "**/*.{js,json,md,sol,ts,yml}"',
      test: "hardhat test",
      "test:sepolia": "hardhat test --network sepolia",
      "build:ts": "tsc --project tsconfig.json",
      typechain: "cross-env TS_NODE_TRANSPILE_ONLY=true hardhat typechain",
      chain: "hardhat node --network hardhat --no-deploy",
      "deploy:localhost": "hardhat deploy --network localhost",
      "deploy:sepolia": "hardhat deploy --network sepolia",
      "verify:sepolia": "hardhat verify --network sepolia",
    },
    dependencies: {
      "encrypted-types": "^0.0.4",
      "@fhevm/solidity": "^0.9.1",
    },
    devDependencies: {
      "@fhevm/hardhat-plugin": "^0.3.0-1",
      "@nomicfoundation/hardhat-chai-matchers": "^2.1.0",
      "@nomicfoundation/hardhat-ethers": "^3.1.0",
      "@nomicfoundation/hardhat-network-helpers": "^1.1.0",
      "@nomicfoundation/hardhat-verify": "^2.1.0",
      "@typechain/ethers-v6": "^0.5.1",
      "@typechain/hardhat": "^9.1.0",
      "@types/chai": "^4.3.20",
      "@types/mocha": "^10.0.10",
      "@types/node": "^20.19.8",
      "@typescript-eslint/eslint-plugin": "^8.37.0",
      "@typescript-eslint/parser": "^8.37.0",
      "@zama-fhe/relayer-sdk": "^0.3.0-5",
      chai: "^4.5.0",
      "chai-as-promised": "^8.0.1",
      "cross-env": "^7.0.3",
      eslint: "^8.57.1",
      "eslint-config-prettier": "^9.1.0",
      ethers: "^6.15.0",
      hardhat: "^2.26.0",
      "hardhat-deploy": "^0.11.45",
      "hardhat-gas-reporter": "^2.3.0",
      mocha: "^11.7.1",
      prettier: "^3.6.2",
      "prettier-plugin-solidity": "^2.1.0",
      rimraf: "^6.0.1",
      solhint: "^6.0.0",
      "solidity-coverage": "^0.8.16",
      "ts-generator": "^0.1.1",
      "ts-node": "^10.9.2",
      typechain: "^8.3.2",
      typescript: "^5.8.3",
    },
  };

  fs.writeFileSync(path.join(outputPath, "package.json"), JSON.stringify(packageJson, null, 2));
}

/**
 * Generates deployment script
 */
function generateDeploymentScript(example: ExampleConfig, outputPath: string): void {
  // Extract contract name from file path
  const contractName = path.basename(example.contractFile, ".sol");

  const deployScript = `import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Deploying ${contractName} contract...");

  const deployment = await deploy("${contractName}", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 1,
  });

  console.log(\`${contractName} deployed to: \${deployment.address}\`);

  // Verify contract on Etherscan if not on local network
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations before verification...");
    await new Promise((resolve) => setTimeout(resolve, 30000));

    try {
      await hre.run("verify:verify", {
        address: deployment.address,
        constructorArguments: [],
      });
    } catch (error) {
      console.error("Verification failed:", error);
    }
  }
};

func.tags = ["${contractName}"];
export default func;
`;

  const deployPath = path.join(outputPath, "deploy", `001_deploy_${example.name}.ts`);
  fs.writeFileSync(deployPath, deployScript);
}

/**
 * Lists all available examples
 */
function listExamples(): void {
  console.log("\n📚 Available FHEVM Examples:\n");

  Object.entries(EXAMPLES).forEach(([key, example]) => {
    console.log(`  ${key}`);
    console.log(`    ${example.description}`);
    console.log(`    Category: ${example.category}`);
    console.log();
  });
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
  console.log("\n📖 Usage:");
  console.log("  npm run create-example <example-name> <output-path>");
  console.log("  ts-node scripts/create-fhevm-example.ts <example-name> <output-path>");
  console.log("\n📋 Options:");
  console.log("  --list    List all available examples");
  console.log("  --help    Show this help message");
  console.log();
  process.exit(0);
}

if (args[0] === "--list") {
  listExamples();
  process.exit(0);
}

const [exampleName, outputPath] = args;

if (!exampleName || !outputPath) {
  console.error("❌ Error: Both example name and output path are required");
  console.log("\n📖 Usage:");
  console.log("  npm run create-example <example-name> <output-path>");
  console.log("\n  Use --list to see available examples");
  process.exit(1);
}

createExample(exampleName, outputPath).catch((error) => {
  console.error("❌ Error creating example:", error);
  process.exit(1);
});
