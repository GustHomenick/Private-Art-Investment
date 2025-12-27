# Scripts Directory

This directory contains utility scripts for the Private Art Investment project.

## Documentation Generator

### `generate-docs.ts`

Generates GitBook-compatible markdown documentation from smart contracts and tests.

#### Usage

```bash
# Generate documentation for specific example
npm run docs:generate

# Generate documentation for all examples
npm run docs:all
```

#### What It Does

- Extracts contract documentation and function signatures
- Parses test cases to show usage patterns
- Generates formatted markdown files
- Creates SUMMARY.md for documentation index
- Includes FHE patterns and common pitfalls

#### Output

Generated files are placed in the `examples/` directory:
- `private-art-investment.md` - Main example documentation
- `SUMMARY.md` - Documentation index

#### Features

- Automatic contract parsing
- Test case extraction
- FHE pattern documentation
- Anti-pattern examples
- Code snippets with syntax highlighting
- Resource links

## Adding New Scripts

To add new utility scripts:

1. Create a new TypeScript file in this directory
2. Import required utilities and Hardhat types
3. Add error handling and logging
4. Document usage in this README
5. Update `package.json` scripts if necessary

Example:

```typescript
// scripts/my-script.ts
import { task } from "hardhat/config";

task("my-task", "Description of my task")
  .setAction(async (args, hre) => {
    // Your logic here
  });
```

## Running Scripts

### Via npm scripts

```bash
npm run <script-name>
```

### Via ts-node

```bash
npx ts-node scripts/script-name.ts <arguments>
```

### Via Hardhat tasks

```bash
npx hardhat <task-name>
```

## Guidelines

- Use TypeScript for type safety
- Include proper error handling
- Add meaningful console output
- Document complex operations
- Follow project code style
- Test scripts thoroughly

## Maintenance

Keep scripts synchronized with:
- Smart contract changes
- Test suite updates
- Dependency upgrades
- Configuration changes
