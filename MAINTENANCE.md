# Maintenance Guide

Guide for maintaining and updating the Private Art Investment project.

## Table of Contents

- [Dependency Management](#dependency-management)
- [Version Updates](#version-updates)
- [Security Updates](#security-updates)
- [Documentation Updates](#documentation-updates)
- [Testing and QA](#testing-and-qa)
- [Release Process](#release-process)
- [Troubleshooting](#troubleshooting)

## Dependency Management

### Checking for Updates

```bash
# Check outdated packages
npm outdated

# Check security vulnerabilities
npm audit

# Get detailed audit report
npm audit --json
```

### Updating Dependencies

**Minor/Patch Updates (Safe)**
```bash
# Update patch versions
npm update

# Update specific package
npm install package-name@latest
```

**Major Updates (Review Required)**
```bash
# Check breaking changes first
npm view package-name@latest

# Carefully update major version
npm install package-name@major-version
```

### Managing FHEVM Dependencies

**Current versions:**
- @fhevm/solidity: ^0.9.1
- @fhevm/hardhat-plugin: ^0.3.0-1
- @zama-fhe/relayer-sdk: ^0.3.0-5

**Update Process:**
1. Check [FHEVM releases](https://github.com/zama-ai/fhevm) for breaking changes
2. Update package.json
3. Run `npm install`
4. Run `npm run compile` to verify
5. Run full test suite
6. Test on mock FHEVM
7. Document changes in CHANGELOG.md

## Version Updates

### Semantic Versioning

Follow [SemVer](https://semver.org/) for version numbers:
- **MAJOR.MINOR.PATCH**
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

### Updating Project Version

```bash
# Update version in package.json
npm version patch    # 1.0.0 → 1.0.1
npm version minor    # 1.0.0 → 1.1.0
npm version major    # 1.0.0 → 2.0.0

# This updates package.json and creates git tag
```

## Security Updates

### Checking for Vulnerabilities

```bash
# Audit packages
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Fix with caution (may include breaking changes)
npm audit fix --force
```

### Critical Security Issues

If a critical vulnerability is found:

1. **Assess Impact**
   - Review vulnerability details
   - Check if project is affected
   - Evaluate severity

2. **Create Security Patch**
   - Create branch: `security/vuln-name`
   - Update vulnerable dependency
   - Run full test suite
   - Document in CHANGELOG.md

3. **Release Security Patch**
   ```bash
   npm version patch
   git push --tags
   ```

4. **Announce to Community**
   - Add security advisory
   - Update README
   - Notify users

## Documentation Updates

### Keeping Documentation Current

**When to Update:**
- After adding new features
- After fixing bugs
- After updating dependencies
- After changing code structure
- After security patches

**What to Update:**
1. `README.md` - If overview changes
2. `USAGE.md` - If usage patterns change
3. `DEVELOPMENT.md` - If development process changes
4. `CHANGELOG.md` - All changes
5. Code comments - Any modifications

### Generated Documentation

```bash
# Regenerate all documentation
npm run docs:generate

# Check if documentation is current
git diff examples/
```

### Documentation Checklist

- [ ] Code examples are current
- [ ] API documentation is accurate
- [ ] Feature descriptions are complete
- [ ] Installation instructions work
- [ ] All links are valid
- [ ] Examples compile and run
- [ ] Test cases are documented

## Testing and QA

### Pre-Release Testing

```bash
# 1. Clean build
npm run clean

# 2. Compile contracts
npm run compile

# 3. Run all tests
npm run test

# 4. Check coverage
npm run coverage

# 5. Run linters
npm run lint

# 6. Build TypeScript
npm run build:ts
```

### Test Coverage Goals

- **Overall**: > 80% coverage
- **Critical paths**: 100% coverage
- **Edge cases**: Covered
- **Error cases**: Handled

### Manual Testing

Before major releases:

1. **Local deployment**
   ```bash
   npm run deploy:localhost
   ```

2. **Testnet deployment**
   ```bash
   npm run deploy:sepolia
   npm run verify:sepolia
   ```

3. **Manual contract interaction**
   ```bash
   npx hardhat console --network localhost
   ```

## Release Process

### Before Release

1. **Update version**
   ```bash
   npm version <major|minor|patch>
   ```

2. **Update CHANGELOG.md**
   - Add new version section
   - List all changes
   - Include breaking changes

3. **Update README.md**
   - Update version numbers
   - Update installation instructions
   - Add new features to overview

4. **Run QA checklist**
   - Compile: `npm run compile`
   - Test: `npm run test`
   - Lint: `npm run lint`
   - Coverage: `npm run coverage`

### Creating Release

```bash
# Tag the release
git tag v1.0.0

# Push tags
git push --tags

# Create GitHub release
# - Upload artifacts
# - Add release notes
# - Link to CHANGELOG

# Publish package (if applicable)
npm publish
```

### Post-Release

1. **Verify release**
   - Check GitHub releases
   - Test installation
   - Verify documentation

2. **Announce release**
   - Update community
   - Share release notes
   - Highlight new features

3. **Monitor for issues**
   - Watch for bug reports
   - Respond to questions
   - Create patches if needed

## Troubleshooting

### Common Maintenance Issues

**Issue: Tests failing after dependency update**

```bash
# 1. Check compatibility
npm outdated

# 2. Review breaking changes
# - Check package CHANGELOG
# - Review migration guides

# 3. Update code if needed
# - Fix breaking changes
# - Update tests

# 4. Verify
npm run test
```

**Issue: Compilation errors**

```bash
# 1. Clean and rebuild
npm run clean
npm run compile

# 2. Check Solidity version
grep "pragma solidity" contracts/*.sol

# 3. Verify imports
# - Check @fhevm/solidity imports
# - Verify paths

# 4. Check compiler settings
# - Review hardhat.config.ts
# - Verify Solidity version
```

**Issue: Test failures after changes**

```bash
# 1. Run specific test
npm run test -- --grep "test name"

# 2. Check test output
# - Review error messages
# - Verify assertions

# 3. Debug issue
# - Add console logs
# - Review contract changes
# - Check test assumptions

# 4. Fix and verify
npm run test
```

### Debugging Commands

```bash
# Run tests with debug output
DEBUG=hardhat:* npm run test

# Run single test file
npx hardhat test test/MyContract.ts

# Run tests with grep pattern
npm run test -- --grep "pattern"

# Clean build
npm run clean && npm run compile

# Check gas usage
REPORT_GAS=true npm run test

# Generate coverage report
npm run coverage && open coverage/index.html
```

## Maintenance Schedule

### Daily
- Monitor GitHub issues
- Check security advisories

### Weekly
- Run full test suite
- Check for updates: `npm outdated`
- Review documentation

### Monthly
- Review and update dependencies
- Check code coverage
- Analyze performance
- Update documentation

### Quarterly
- Major version planning
- Feature review
- Security audit
- Community feedback review

### Annually
- Major version release (if applicable)
- Comprehensive security review
- Architecture review
- Dependency modernization

## Documentation References

**Internal:**
- [CHANGELOG.md](CHANGELOG.md) - Version history
- [README.md](README.md) - Project overview
- [USAGE.md](USAGE.md) - Usage guide
- [DEVELOPMENT.md](DEVELOPMENT.md) - Development guide

**External:**
- [npm Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [Git Tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging)

## Support

For maintenance questions or issues:
- Check [GitHub Issues](https://github.com)
- Review [Zama Community](https://www.zama.ai/community)
- Ask on [Discord](https://discord.com/invite/zama)

---

**Last Updated**: December 2025

Keep this project maintained and secure! 🔒
