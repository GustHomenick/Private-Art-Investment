/**
 * @title Documentation Generator
 * @notice Generates GitBook-compatible markdown documentation from contracts and tests
 * @dev This script extracts code and comments to create comprehensive example documentation
 */

import * as fs from "fs";
import * as path from "path";

interface ExampleConfig {
  name: string;
  title: string;
  description: string;
  category: string;
  contractFile: string;
  testFile: string;
  concepts: string[];
}

const EXAMPLES_CONFIG: ExampleConfig[] = [
  {
    name: "private-art-investment",
    title: "Private Art Investment",
    description: "Privacy-preserving art collection investment using FHE encryption",
    category: "Advanced Examples",
    contractFile: "contracts/PrivateArtInvestment.sol",
    testFile: "test/PrivateArtInvestment.ts",
    concepts: ["FHE Encryption", "Access Control", "Homomorphic Operations", "User Decryption"],
  },
];

interface DocumentationEntry {
  title: string;
  path: string;
  section: string;
}

// Generate documentation
async function generateDocumentation(exampleName?: string): Promise<void> {
  const baseDir = process.cwd();
  const examplesDir = path.join(baseDir, "examples");

  // Create examples directory if it doesn't exist
  if (!fs.existsSync(examplesDir)) {
    fs.mkdirSync(examplesDir, { recursive: true });
  }

  // Filter examples
  const examples = exampleName
    ? EXAMPLES_CONFIG.filter((e) => e.name === exampleName)
    : EXAMPLES_CONFIG;

  if (examples.length === 0) {
    console.error(`No example found with name: ${exampleName}`);
    process.exit(1);
  }

  const documentation: DocumentationEntry[] = [];

  // Generate documentation for each example
  for (const example of examples) {
    console.log(`Generating documentation for: ${example.title}...`);

    const contractPath = path.join(baseDir, example.contractFile);
    const testPath = path.join(baseDir, example.testFile);

    // Read contract and test files
    const contractContent = fs.readFileSync(contractPath, "utf-8");
    const testContent = fs.readFileSync(testPath, "utf-8");

    // Generate markdown
    const markdown = generateExampleMarkdown(example, contractContent, testContent);

    // Write markdown file
    const outputPath = path.join(examplesDir, `${example.name}.md`);
    fs.writeFileSync(outputPath, markdown);

    documentation.push({
      title: example.title,
      path: `${example.name}.md`,
      section: example.category,
    });

    console.log(`✓ Generated: ${outputPath}`);
  }

  // Generate SUMMARY.md
  generateSummary(examplesDir, documentation);

  console.log(`\n✅ Documentation generated in ${examplesDir}`);
}

function generateExampleMarkdown(example: ExampleConfig, contractContent: string, testContent: string): string {
  const contractLines = contractContent.split("\n");
  const testLines = testContent.split("\n");

  // Extract key parts
  const description = extractDocstring(contractLines);
  const keyFunctions = extractFunctions(contractLines);
  const testCases = extractTestCases(testLines);

  return `# ${example.title}

${example.description}

## Overview

${description}

## Key Concepts

${example.concepts.map((c) => `- **${c}**`).join("\n")}

## Contract Structure

### Main Functions

${keyFunctions}

## Test Coverage

This example includes comprehensive tests demonstrating:

${testCases}

## FHE Patterns Used

### Encryption
\`\`\`solidity
euint32 encrypted = FHE.asEuint32(value);
FHE.allowThis(encrypted);
FHE.allow(encrypted, msg.sender);
\`\`\`

### Homomorphic Operations
\`\`\`solidity
euint32 result = FHE.add(encrypted1, encrypted2);
\`\`\`

### User Decryption
\`\`\`typescript
const decrypted = await fhevm.userDecryptEuint(
  FhevmType.euint32,
  encryptedValue,
  contractAddress,
  signer
);
\`\`\`

## Common Pitfalls

### ❌ Missing allowThis()
Without \`FHE.allowThis()\`, the contract cannot use the encrypted value:

\`\`\`solidity
// WRONG - will fail!
FHE.allow(encryptedValue, msg.sender);
\`\`\`

### ❌ View Functions with Encrypted Values
Encrypted values cannot be returned from view functions:

\`\`\`solidity
// WRONG - view functions cannot return encrypted data
function getEncrypted() public view returns (euint32) {
    return _encrypted;
}
\`\`\`

## Security Considerations

1. Always grant both contract and user permissions
2. Validate input before encryption
3. Use appropriate encrypted types (euint32, euint64, etc.)
4. Remember that encrypted data is opaque on-chain
5. Plan decryption requests carefully

## Running the Example

\`\`\`bash
# Compile
npm run compile

# Run tests
npm run test

# Deploy
npm run deploy:localhost
\`\`\`

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/)
- [Solidity Documentation](https://docs.soliditylang.org/)

## Next Steps

1. Study the contract implementation in \`contracts/${example.contractFile}\`
2. Review the test cases in \`test/${example.testFile}\`
3. Experiment with modifications and run tests
4. Deploy to a test network using Hardhat
5. Explore other examples and advanced patterns
`;
}

function extractDocstring(lines: string[]): string {
  // Extract contract-level documentation
  let inDocstring = false;
  let docstring = "";

  for (const line of lines) {
    if (line.includes("/**")) {
      inDocstring = true;
    }
    if (inDocstring) {
      docstring += line + "\n";
      if (line.includes("*/")) {
        break;
      }
    }
  }

  return docstring.replace(/\/\*\*|\*\/|\* /g, "").trim() || "Example contract demonstrating FHE encryption patterns.";
}

function extractFunctions(lines: string[]): string {
  const functions: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Look for function declarations (simplified)
    if (line.includes("function") && !line.includes("//")) {
      // Extract function name and signature
      const match = line.match(/function\s+(\w+)\s*\([^)]*\)/);
      if (match && !match[1].startsWith("_")) {
        functions.push(`- \`${match[1]}()\` - ${extractFunctionDoc(lines, i)}`);
      }
    }
  }

  return functions.slice(0, 5).join("\n") || "- Main contract functions";
}

function extractFunctionDoc(lines: string[], functionIndex: number): string {
  // Look backwards for comments
  for (let i = functionIndex - 1; i >= Math.max(0, functionIndex - 5); i--) {
    if (lines[i].includes("@notice") || lines[i].includes("//")) {
      return lines[i].replace(/.*@notice\s*|.*\/\/\s*/g, "").trim() || "Function";
    }
  }
  return "Contract function";
}

function extractTestCases(lines: string[]): string {
  const testCases: string[] = [];

  for (const line of lines) {
    if (line.includes("it(")) {
      // Extract test name
      const match = line.match(/it\("([^"]+)"/);
      if (match) {
        testCases.push(`- ${match[1]}`);
      }
    }
  }

  return testCases.slice(0, 10).join("\n") || "- Comprehensive test coverage";
}

function generateSummary(examplesDir: string, documentation: DocumentationEntry[]): void {
  // Group by section
  const sections: Map<string, DocumentationEntry[]> = new Map();

  for (const entry of documentation) {
    if (!sections.has(entry.section)) {
      sections.set(entry.section, []);
    }
    sections.get(entry.section)!.push(entry);
  }

  // Generate SUMMARY.md
  let summary = "# Private Art Investment Examples\n\n";
  summary += "## Documentation Index\n\n";

  for (const [section, entries] of sections) {
    summary += `### ${section}\n\n`;
    for (const entry of entries) {
      summary += `- [${entry.title}](${entry.path})\n`;
    }
    summary += "\n";
  }

  summary += "## Quick Start\n\n";
  summary += "1. Install dependencies: `npm install`\n";
  summary += "2. Compile contracts: `npm run compile`\n";
  summary += "3. Run tests: `npm run test`\n";
  summary += "4. Deploy: `npm run deploy:localhost`\n";

  const summaryPath = path.join(examplesDir, "SUMMARY.md");
  fs.writeFileSync(summaryPath, summary);
  console.log(`✓ Generated: ${summaryPath}`);
}

// Main execution
const exampleName = process.argv[2];
generateDocumentation(exampleName).catch((error) => {
  console.error("Error generating documentation:", error);
  process.exit(1);
});
