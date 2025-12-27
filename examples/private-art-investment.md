# Private Art Investment

Privacy-preserving art collection investment using FHE encryption

## Overview

The Private Art Investment platform demonstrates how Fully Homomorphic Encryption (FHE) can be applied to create privacy-preserving smart contracts on Ethereum. This example showcases a real-world use case where investors can purchase fractional shares of valuable artworks while maintaining complete privacy of their investment amounts and portfolio holdings.

### Why FHE for Art Investment?

Traditional blockchain-based art investment platforms expose all transaction data publicly, including:
- Investment amounts
- Portfolio holdings
- Share quantities
- Investor identities

This lack of privacy creates several problems:
1. **Competitive disadvantage**: Large investors reveal their strategies
2. **Privacy concerns**: High-net-worth individuals want confidentiality
3. **Market manipulation**: Visible holdings can affect prices
4. **Personal security**: Public wealth display creates risks

FHE solves these problems by enabling computations on encrypted data without revealing the underlying values.

## Key Concepts

### 1. FHE Encryption

Investment amounts are encrypted on-chain using the `euint32` type:

```solidity
// Encrypt investment amount
euint32 encryptedShares = FHE.asEuint32(shareAmount);
euint32 encryptedValue = FHE.asEuint32(uint32(msg.value / 1e14));
```

The encrypted values are stored on-chain but remain invisible to external observers.

### 2. Access Control

FHE requires proper permission management:

```solidity
// Grant contract permission
FHE.allowThis(encryptedShares);
FHE.allowThis(encryptedValue);

// Grant user permission for decryption
FHE.allow(encryptedShares, msg.sender);
FHE.allow(encryptedValue, msg.sender);
```

Both permissions are necessary:
- `allowThis()` - Contract can use the encrypted value
- `allow(value, user)` - User can decrypt their own value

### 3. Homomorphic Operations

Perform computations on encrypted data:

```solidity
// Update encrypted portfolio total
euint32 currentTotal = investorProfiles[msg.sender].encryptedTotalInvestment;
investorProfiles[msg.sender].encryptedTotalInvestment =
    FHE.add(currentTotal, encryptedValue);

// Increment encrypted portfolio count
euint32 currentPortfolio = investorProfiles[msg.sender].encryptedPortfolioCount;
investorProfiles[msg.sender].encryptedPortfolioCount =
    FHE.add(currentPortfolio, FHE.asEuint32(1));
```

The contract can compute totals without knowing the actual values!

### 4. User Decryption

Investors can decrypt their own holdings:

```typescript
const encryptedShares = await contract.getEncryptedShares(
  investor.address,
  artworkId
);

const decryptedShares = await fhevm.userDecryptEuint(
  FhevmType.euint32,
  encryptedShares,
  contractAddress,
  investor
);
```

## Contract Structure

### Core Data Structures

```solidity
struct PrivateInvestment {
    euint32 encryptedShares;       // Encrypted share amount
    euint32 encryptedValue;        // Encrypted investment value
    bool hasInvested;
    uint256 timestamp;
}

struct InvestorProfile {
    euint32 encryptedTotalInvestment;    // Total invested (encrypted)
    euint32 encryptedPortfolioCount;     // Number of investments (encrypted)
    bool isRegistered;
    uint256 registeredAt;
}
```

### Main Functions

#### `registerInvestor()`
Registers a new investor with encrypted profile initialization:

```solidity
function registerInvestor() external {
    euint32 zeroInvestment = FHE.asEuint32(0);
    euint32 zeroPortfolio = FHE.asEuint32(0);

    investorProfiles[msg.sender] = InvestorProfile({
        encryptedTotalInvestment: zeroInvestment,
        encryptedPortfolioCount: zeroPortfolio,
        isRegistered: true,
        registeredAt: block.timestamp
    });

    FHE.allowThis(zeroInvestment);
    FHE.allowThis(zeroPortfolio);
    FHE.allow(zeroInvestment, msg.sender);
    FHE.allow(zeroPortfolio, msg.sender);
}
```

#### `listArtwork()`
Owner lists artwork with fractional shares:

```solidity
function listArtwork(
    string memory _name,
    string memory _artist,
    string memory _ipfsHash,
    uint256 _totalValue,
    uint256 _sharePrice,
    uint256 _totalShares
) external onlyOwner
```

#### `makePrivateInvestment()`
Investor makes confidential investment:

```solidity
function makePrivateInvestment(
    uint256 artworkId,
    uint32 shareAmount
) external payable onlyRegisteredInvestor validArtwork(artworkId) {
    // Encrypt investment data
    euint32 encryptedShares = FHE.asEuint32(shareAmount);
    euint32 encryptedValue = FHE.asEuint32(uint32(msg.value / 1e14));

    // Store encrypted investment
    artworkInvestments[artworkId][msg.sender] = PrivateInvestment({
        encryptedShares: encryptedShares,
        encryptedValue: encryptedValue,
        hasInvested: true,
        timestamp: block.timestamp
    });

    // Update encrypted portfolio
    // ... homomorphic operations ...

    // Grant permissions
    FHE.allowThis(encryptedShares);
    FHE.allow(encryptedShares, msg.sender);
}
```

## Test Coverage

The example includes comprehensive tests demonstrating:

### Basic Functionality
- Contract deployment and initialization
- Investor registration with encrypted profiles
- Artwork listing and validation
- Private investment flow

### FHE Patterns
- Encryption of investment amounts
- Homomorphic portfolio calculations
- Permission system (allowThis + allow)
- Encrypted value retrieval

### Access Control
- Owner-only functions
- Investor-only restrictions
- Registration requirements
- Invalid state handling

### Edge Cases
- Duplicate registration prevention
- Insufficient payment handling
- Exceeding available shares
- Zero share investments
- Emergency withdrawal

### Anti-Patterns
- Unregistered investor investments (fails correctly)
- Duplicate investments in same artwork (fails correctly)
- Mismatched value calculations (fails correctly)
- Invalid share amounts (fails correctly)

## FHE Patterns Used

### Pattern 1: Encrypted Value Initialization

```solidity
// Initialize with encrypted zero
euint32 zeroValue = FHE.asEuint32(0);

// Grant both permissions
FHE.allowThis(zeroValue);
FHE.allow(zeroValue, userAddress);
```

### Pattern 2: Homomorphic Accumulation

```solidity
// Add to encrypted total
euint32 currentTotal = profile.encryptedTotalInvestment;
profile.encryptedTotalInvestment = FHE.add(currentTotal, newValue);

// Grant permissions for new value
FHE.allowThis(profile.encryptedTotalInvestment);
FHE.allow(profile.encryptedTotalInvestment, msg.sender);
```

### Pattern 3: User Decryption

```typescript
const encryptedValue = await contract.getEncryptedShares(investor, artworkId);

const decrypted = await fhevm.userDecryptEuint(
  FhevmType.euint32,
  encryptedValue,
  contractAddress,
  investor
);
```

## Common Pitfalls

### ❌ Pitfall 1: Missing allowThis()

Without `FHE.allowThis()`, the contract cannot use the encrypted value in future operations:

```solidity
// WRONG - contract can't access value later!
FHE.allow(encryptedValue, msg.sender);

// CORRECT - both permissions needed
FHE.allowThis(encryptedValue);
FHE.allow(encryptedValue, msg.sender);
```

### ❌ Pitfall 2: View Functions with Encrypted Values

Encrypted values cannot be meaningfully returned from view functions:

```solidity
// PROBLEMATIC - view functions can't decrypt
function getEncryptedValue() public view returns (euint32) {
    return _encrypted;  // Returns opaque handle, not useful
}

// BETTER - use external for encrypted returns
function getEncryptedValue() external view returns (euint32) {
    return _encrypted;
}
```

### ❌ Pitfall 3: Mismatched Encryption Signers

The signer who encrypts must be the same as the transaction sender:

```typescript
// WRONG - Alice encrypts, Bob submits
const encrypted = await fhevm.createEncryptedInput(contract, alice.address)
    .add32(123).encrypt();
await contract.connect(bob).operation(encrypted);  // FAILS!

// CORRECT - same signer
const encrypted = await fhevm.createEncryptedInput(contract, alice.address)
    .add32(123).encrypt();
await contract.connect(alice).operation(encrypted);  // SUCCESS
```

### ❌ Pitfall 4: Forgetting Permission Updates

After homomorphic operations, update permissions:

```solidity
// WRONG - missing permission for new value
euint32 newTotal = FHE.add(currentTotal, newValue);

// CORRECT - grant permissions for result
euint32 newTotal = FHE.add(currentTotal, newValue);
FHE.allowThis(newTotal);
FHE.allow(newTotal, msg.sender);
```

## Security Considerations

### 1. Permission Management
- Always grant both `allowThis()` and `allow(user)` permissions
- Update permissions after homomorphic operations
- Verify permissions before decryption requests

### 2. Input Validation
- Validate plaintext inputs before encryption
- Check ranges and bounds
- Prevent overflow in encrypted types

### 3. Privacy Guarantees
- Investment amounts are private
- Share quantities are private
- Portfolio totals are private
- Transaction existence is public

### 4. Decryption Requests
- Plan decryption carefully (async operation)
- Verify signatures on decrypted values
- Handle decryption failures gracefully

## Running the Example

### Prerequisites
```bash
Node.js >= 20
npm >= 7.0.0
```

### Setup
```bash
# Install dependencies
npm install

# Set up environment variables
npx hardhat vars setup
```

### Development
```bash
# Compile contracts
npm run compile

# Run tests
npm run test

# Run with gas reporting
REPORT_GAS=true npm run test

# Check code quality
npm run lint

# Format code
npm run prettier:write
```

### Deployment
```bash
# Deploy to localhost
npm run deploy:localhost

# Deploy to Sepolia testnet
npm run deploy:sepolia

# Verify on Etherscan
npm run verify:sepolia
```

## Resources

### Official Documentation
- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHE Solidity Library](https://github.com/zama-ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/)

### Related Examples
- [Base Hardhat Template](https://github.com/zama-ai/fhevm-hardhat-template)
- [OpenZeppelin Confidential Contracts](https://github.com/OpenZeppelin/openzeppelin-confidential-contracts)

### Community
- [Zama Community Forum](https://www.zama.ai/community)
- [Zama Discord](https://discord.com/invite/zama)

## Next Steps

1. **Study the Code**: Review `contracts/PrivateArtInvestment.sol`
2. **Run Tests**: Execute `npm run test` to see patterns in action
3. **Experiment**: Modify the contract and test your changes
4. **Deploy**: Try deploying to a testnet
5. **Explore**: Check out other FHEVM examples

## License

BSD-3-Clause-Clear - See [LICENSE](../LICENSE) for details

---

**Built with ❤️ using FHEVM by Zama**
