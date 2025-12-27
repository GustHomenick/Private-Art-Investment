# Contributing to Private Art Investment

We welcome contributions to the Private Art Investment project! Please follow these guidelines to ensure consistency and quality.

## Code Standards

### Solidity

- Use Solidity version 0.8.27 or later
- Follow official [Solidity style guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Run `npm run lint:sol` to check for style violations
- Include comprehensive comments explaining FHE concepts
- Demonstrate both correct usage and common anti-patterns

### TypeScript

- Use TypeScript strict mode
- Follow ESLint and Prettier configuration
- Run `npm run lint` before submitting
- Use descriptive variable and function names
- Include JSDoc comments for public functions

### Testing

- Write tests for all new functionality
- Include both positive and negative test cases
- Use the 18-character padding for BigInt values
- Mock FHEVM environment for testing
- Aim for >80% code coverage

## Commit Messages

Follow conventional commit format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`

Example:
```
feat(contract): add encrypted voting mechanism

Implement homomorphic voting with FHE encryption
to allow confidential vote tallying.

Fixes #123
```

## Pull Request Process

1. **Fork the repository** and create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following code standards
   ```bash
   npm run compile
   npm run test
   npm run lint
   ```

3. **Ensure all tests pass**
   ```bash
   npm run test
   npm run coverage
   ```

4. **Format your code**
   ```bash
   npm run prettier:write
   ```

5. **Create a Pull Request** with clear description of changes

## Testing Requirements

Before submitting:

1. All tests must pass:
   ```bash
   npm run test
   ```

2. Code coverage must not decrease

3. Linting must pass:
   ```bash
   npm run lint
   ```

4. TypeScript compilation must succeed:
   ```bash
   npm run build:ts
   ```

## FHE Best Practices

When adding new FHE features:

### ✅ DO

- Always use `FHE.allowThis()` for contract permissions
- Always use `FHE.allow()` for user permissions
- Document which values are encrypted
- Include tests demonstrating decryption
- Explain why encryption is necessary

### ❌ DON'T

- Forget `FHE.allowThis()` before user decryption
- Use view functions with encrypted return values
- Mix encrypted and unencrypted values without care
- Assume encrypted values are visible on-chain

## Documentation

- Update README.md for user-facing changes
- Include JSDoc comments for all public functions
- Document FHE-specific behavior
- Include examples in code comments

Example:
```typescript
/**
 * @title Encrypt and store investment
 * @notice Encrypts the investment amount and grants appropriate permissions
 * @dev Demonstrates proper FHE permission setup
 *
 * Key Points:
 * - Investment is encrypted as euint32
 * - Both contract and user need permissions
 * - Homomorphic operations performed on encrypted data
 */
```

## Adding New Examples

When adding new FHE examples:

1. **Create contract** in `contracts/` with clear comments
2. **Write tests** in `test/` showing usage patterns
3. **Document** all FHE operations
4. **Include anti-patterns** showing common mistakes
5. **Update** README with new example

## Bug Reports

Include:

- [ ] Clear description of the bug
- [ ] Steps to reproduce
- [ ] Expected behavior
- [ ] Actual behavior
- [ ] Environment details
- [ ] Error messages and logs

## Feature Requests

Include:

- [ ] Clear description of the feature
- [ ] Use case and motivation
- [ ] Proposed API/interface
- [ ] Examples of usage
- [ ] Potential FHE challenges

## Questions?

- Open a GitHub issue for clarification
- Check existing issues and documentation first
- Ask in the Zama community forums

## License

By contributing, you agree that your contributions will be licensed under the BSD-3-Clause-Clear License.

Thank you for contributing to Private Art Investment!
