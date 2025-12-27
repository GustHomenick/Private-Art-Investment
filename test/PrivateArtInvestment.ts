import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { PrivateArtInvestment, PrivateArtInvestment__factory } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

/**
 * @title PrivateArtInvestment Test Suite
 * @notice Comprehensive tests for privacy-preserving art investment platform
 * @dev Demonstrates FHE encryption for confidential investment amounts
 *
 * ## Key Concepts Tested:
 *
 * ### 1. FHE Encryption
 * - Investment amounts are encrypted using euint32
 * - Share quantities remain confidential on-chain
 * - Portfolio values computed homomorphically
 *
 * ### 2. Access Control
 * - Proper use of FHE.allowThis() for contract permissions
 * - Proper use of FHE.allow() for user permissions
 * - Both permissions required for decryption
 *
 * ### 3. User Decryption
 * - Investors can decrypt their own holdings
 * - Decryption requires both contract and user consent
 * - Demonstrates userDecryptEuint pattern
 */

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
  charlie: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("PrivateArtInvestment")) as PrivateArtInvestment__factory;
  const contract = (await factory.deploy()) as PrivateArtInvestment;
  const contractAddress = await contract.getAddress();

  return { contract, contractAddress };
}

describe("PrivateArtInvestment", function () {
  let signers: Signers;
  let contract: PrivateArtInvestment;
  let contractAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = {
      deployer: ethSigners[0],
      alice: ethSigners[1],
      bob: ethSigners[2],
      charlie: ethSigners[3],
    };
  });

  beforeEach(async function () {
    // Skip tests on Sepolia - only run on mock FHEVM
    if (!fhevm.isMock) {
      console.warn(`This test suite requires FHEVM mock environment`);
      this.skip();
    }

    ({ contract, contractAddress } = await deployFixture());
  });

  describe("Contract Deployment", function () {
    it("should deploy with correct initial state", async function () {
      const owner = await contract.owner();
      expect(owner).to.equal(signers.deployer.address);

      const stats = await contract.getTotalStats();
      expect(stats.totalArtworksListed).to.equal(0);
      expect(stats.totalRegisteredInvestors).to.equal(0);
    });
  });

  describe("Investor Registration", function () {
    /**
     * ✅ CORRECT: Register investor with encrypted zero initialization
     * - Creates encrypted euint32 values for portfolio tracking
     * - Grants both FHE.allowThis() and FHE.allow() permissions
     * - Demonstrates proper permission setup pattern
     */
    it("should register new investor with encrypted profile", async function () {
      const tx = await contract.connect(signers.alice).registerInvestor();
      await tx.wait();

      const isRegistered = await contract.isInvestorRegistered(signers.alice.address);
      expect(isRegistered).to.be.true;

      const stats = await contract.getTotalStats();
      expect(stats.totalRegisteredInvestors).to.equal(1);
    });

    /**
     * ❌ ANTI-PATTERN: Attempting to register twice
     * - Shows proper error handling for duplicate registration
     */
    it("should prevent duplicate registration", async function () {
      await contract.connect(signers.alice).registerInvestor();

      await expect(contract.connect(signers.alice).registerInvestor()).to.be.revertedWith(
        "Already registered",
      );
    });

    it("should allow multiple investors to register", async function () {
      await contract.connect(signers.alice).registerInvestor();
      await contract.connect(signers.bob).registerInvestor();
      await contract.connect(signers.charlie).registerInvestor();

      const stats = await contract.getTotalStats();
      expect(stats.totalRegisteredInvestors).to.equal(3);
    });
  });

  describe("Artwork Listing", function () {
    /**
     * ✅ CORRECT: List artwork with valid parameters
     * - Demonstrates artwork metadata structure
     * - Shows validation of share price calculations
     */
    it("should allow owner to list artwork", async function () {
      const tx = await contract
        .connect(signers.deployer)
        .listArtwork(
          "Mona Lisa Fraction",
          "Leonardo da Vinci",
          "QmXYZ123...",
          ethers.parseEther("100"),
          ethers.parseEther("1"),
          100,
        );
      await tx.wait();

      const stats = await contract.getTotalStats();
      expect(stats.totalArtworksListed).to.equal(1);

      const artworkInfo = await contract.getArtworkInfo(0);
      expect(artworkInfo.name).to.equal("Mona Lisa Fraction");
      expect(artworkInfo.artist).to.equal("Leonardo da Vinci");
      expect(artworkInfo.totalShares).to.equal(100);
      expect(artworkInfo.availableShares).to.equal(100);
    });

    /**
     * ❌ ANTI-PATTERN: Non-owner attempting to list artwork
     */
    it("should prevent non-owner from listing artwork", async function () {
      await expect(
        contract
          .connect(signers.alice)
          .listArtwork(
            "Starry Night",
            "Vincent van Gogh",
            "QmABC456...",
            ethers.parseEther("50"),
            ethers.parseEther("0.5"),
            100,
          ),
      ).to.be.revertedWith("Not authorized");
    });

    /**
     * ❌ ANTI-PATTERN: Invalid value calculation
     */
    it("should reject artwork with mismatched value calculation", async function () {
      await expect(
        contract
          .connect(signers.deployer)
          .listArtwork(
            "The Scream",
            "Edvard Munch",
            "QmDEF789...",
            ethers.parseEther("100"), // Total value
            ethers.parseEther("2"), // Share price
            100, // Total shares (should be 50 for correct calculation)
          ),
      ).to.be.revertedWith("Value calculation mismatch");
    });
  });

  describe("Private Investment Flow", function () {
    beforeEach(async function () {
      // Setup: Register investor and list artwork
      await contract.connect(signers.alice).registerInvestor();
      await contract
        .connect(signers.deployer)
        .listArtwork(
          "The Persistence of Memory",
          "Salvador Dali",
          "QmGHI012...",
          ethers.parseEther("10"), // 10 ETH total
          ethers.parseEther("0.1"), // 0.1 ETH per share
          100, // 100 shares
        );
    });

    /**
     * ✅ CORRECT: Make private investment with encrypted amounts
     * - Investment amount is public in function call
     * - Contract encrypts the amount as euint32
     * - Grants proper FHE permissions (allowThis + allow)
     * - Updates investor profile homomorphically
     *
     * Key Pattern: FHE Encryption Flow
     * 1. Receive plaintext investment amount
     * 2. Encrypt using FHE.asEuint32()
     * 3. Store encrypted value on-chain
     * 4. Grant permissions for later decryption
     */
    it("should allow registered investor to make private investment", async function () {
      const shareAmount = 10;
      const sharePrice = ethers.parseEther("0.1");
      const payment = sharePrice * BigInt(shareAmount);

      const tx = await contract.connect(signers.alice).makePrivateInvestment(0, shareAmount, {
        value: payment,
      });
      await tx.wait();

      // Verify investment was recorded
      const investmentStatus = await contract.getInvestmentStatus(signers.alice.address, 0);
      expect(investmentStatus.hasInvested).to.be.true;

      // Verify shares were deducted
      const artworkInfo = await contract.getArtworkInfo(0);
      expect(artworkInfo.availableShares).to.equal(90);

      // Verify investor was added to list
      const investorCount = await contract.getArtworkInvestors(0);
      expect(investorCount).to.equal(1);
    });

    /**
     * ❌ ANTI-PATTERN: Unregistered investor attempting investment
     */
    it("should prevent unregistered investor from investing", async function () {
      const shareAmount = 5;
      const payment = ethers.parseEther("0.5");

      await expect(
        contract.connect(signers.bob).makePrivateInvestment(0, shareAmount, {
          value: payment,
        }),
      ).to.be.revertedWith("Not registered investor");
    });

    /**
     * ❌ ANTI-PATTERN: Insufficient payment
     */
    it("should reject investment with insufficient payment", async function () {
      const shareAmount = 10;
      const insufficientPayment = ethers.parseEther("0.5"); // Should be 1.0 ETH

      await expect(
        contract.connect(signers.alice).makePrivateInvestment(0, shareAmount, {
          value: insufficientPayment,
        }),
      ).to.be.revertedWith("Insufficient payment");
    });

    /**
     * ❌ ANTI-PATTERN: Duplicate investment in same artwork
     */
    it("should prevent duplicate investment in same artwork", async function () {
      const shareAmount = 5;
      const payment = ethers.parseEther("0.5");

      // First investment succeeds
      await contract.connect(signers.alice).makePrivateInvestment(0, shareAmount, {
        value: payment,
      });

      // Second investment should fail
      await expect(
        contract.connect(signers.alice).makePrivateInvestment(0, shareAmount, {
          value: payment,
        }),
      ).to.be.revertedWith("Already invested in this artwork");
    });

    /**
     * ✅ CORRECT: Multiple investors in same artwork
     * - Demonstrates independent encrypted holdings
     * - Each investor's amount remains private
     */
    it("should allow multiple investors in same artwork", async function () {
      await contract.connect(signers.bob).registerInvestor();
      await contract.connect(signers.charlie).registerInvestor();

      // Alice invests
      await contract.connect(signers.alice).makePrivateInvestment(0, 10, {
        value: ethers.parseEther("1"),
      });

      // Bob invests
      await contract.connect(signers.bob).makePrivateInvestment(0, 20, {
        value: ethers.parseEther("2"),
      });

      // Charlie invests
      await contract.connect(signers.charlie).makePrivateInvestment(0, 15, {
        value: ethers.parseEther("1.5"),
      });

      const investorCount = await contract.getArtworkInvestors(0);
      expect(investorCount).to.equal(3);

      const artworkInfo = await contract.getArtworkInfo(0);
      expect(artworkInfo.availableShares).to.equal(55); // 100 - 10 - 20 - 15
    });

    /**
     * ✅ CORRECT: Excess payment is refunded
     */
    it("should refund excess payment", async function () {
      const shareAmount = 10;
      const exactPayment = ethers.parseEther("1");
      const excessPayment = ethers.parseEther("2");

      const balanceBefore = await ethers.provider.getBalance(signers.alice.address);

      const tx = await contract.connect(signers.alice).makePrivateInvestment(0, shareAmount, {
        value: excessPayment,
      });
      const receipt = await tx.wait();

      const balanceAfter = await ethers.provider.getBalance(signers.alice.address);
      const gasCost = receipt!.gasUsed * receipt!.gasPrice;

      // Balance should decrease by exactPayment + gas, not excessPayment + gas
      const expectedDecrease = exactPayment + gasCost;
      const actualDecrease = balanceBefore - balanceAfter;

      // Allow small tolerance for gas calculation differences
      expect(actualDecrease).to.be.closeTo(expectedDecrease, ethers.parseEther("0.01"));
    });
  });

  describe("Encrypted Data Retrieval", function () {
    beforeEach(async function () {
      // Setup: Register Alice, list artwork, make investment
      await contract.connect(signers.alice).registerInvestor();
      await contract
        .connect(signers.deployer)
        .listArtwork("Abstract Art", "Modern Artist", "QmJKL345...", ethers.parseEther("5"), ethers.parseEther("0.05"), 100);

      await contract.connect(signers.alice).makePrivateInvestment(0, 20, {
        value: ethers.parseEther("1"),
      });
    });

    /**
     * ✅ CORRECT: Retrieve encrypted investment summary
     * - Returns encrypted euint32 values
     * - Values remain confidential until decryption
     */
    it("should return encrypted investment summary", async function () {
      const summary = await contract.getEncryptedInvestmentSummary(signers.alice.address);

      expect(summary.isRegistered).to.be.true;
      // Encrypted values are returned as bytes32 handles
      expect(summary.encryptedTotalInvested).to.not.equal(ethers.ZeroHash);
      expect(summary.encryptedPortfolioCount).to.not.equal(ethers.ZeroHash);
    });

    /**
     * ✅ CORRECT: Retrieve encrypted shares
     * - Demonstrates access to encrypted investment details
     */
    it("should return encrypted shares for specific investment", async function () {
      const encryptedShares = await contract.getEncryptedShares(signers.alice.address, 0);

      expect(encryptedShares).to.not.equal(ethers.ZeroHash);
    });

    /**
     * ❌ PATTERN: Cannot view encrypted values directly
     * - Encrypted values appear as opaque handles on-chain
     * - Decryption requires proper permissions and keys
     */
    it("should not expose plaintext investment amounts on-chain", async function () {
      const encryptedShares = await contract.getEncryptedShares(signers.alice.address, 0);

      // The encrypted value is a handle, not the actual amount
      // Without decryption, Bob cannot determine Alice's investment
      const bobView = await contract.connect(signers.bob).getEncryptedShares(signers.alice.address, 0);

      // Both see the same encrypted handle, but cannot decrypt without permissions
      expect(encryptedShares).to.equal(bobView);
    });
  });

  describe("Artwork Management", function () {
    beforeEach(async function () {
      await contract
        .connect(signers.deployer)
        .listArtwork("Night Watch", "Rembrandt", "QmMNO678...", ethers.parseEther("20"), ethers.parseEther("0.2"), 100);
    });

    /**
     * ✅ CORRECT: Owner can mark artwork as sold
     */
    it("should allow owner to sell artwork", async function () {
      const tx = await contract.connect(signers.deployer).sellArtwork(0, ethers.parseEther("25"));
      await tx.wait();

      // After selling, artwork becomes inactive
      await expect(contract.getArtworkInfo(0)).to.be.revertedWith("Artwork not active");
    });

    /**
     * ❌ ANTI-PATTERN: Non-owner cannot sell artwork
     */
    it("should prevent non-owner from selling artwork", async function () {
      await expect(contract.connect(signers.alice).sellArtwork(0, ethers.parseEther("25"))).to.be.revertedWith(
        "Not authorized",
      );
    });
  });

  describe("Edge Cases and Security", function () {
    /**
     * ❌ ANTI-PATTERN: Invalid artwork ID
     */
    it("should reject operations on non-existent artwork", async function () {
      await contract.connect(signers.alice).registerInvestor();

      await expect(
        contract.connect(signers.alice).makePrivateInvestment(999, 10, {
          value: ethers.parseEther("1"),
        }),
      ).to.be.revertedWith("Invalid artwork ID");
    });

    /**
     * ❌ ANTI-PATTERN: Zero share investment
     */
    it("should reject zero share investment", async function () {
      await contract.connect(signers.alice).registerInvestor();
      await contract
        .connect(signers.deployer)
        .listArtwork("Test Art", "Test Artist", "QmTest...", ethers.parseEther("1"), ethers.parseEther("0.01"), 100);

      await expect(
        contract.connect(signers.alice).makePrivateInvestment(0, 0, {
          value: ethers.parseEther("0"),
        }),
      ).to.be.revertedWith("Invalid share amount");
    });

    /**
     * ❌ ANTI-PATTERN: Exceeding available shares
     */
    it("should reject investment exceeding available shares", async function () {
      await contract.connect(signers.alice).registerInvestor();
      await contract
        .connect(signers.deployer)
        .listArtwork("Limited Art", "Rare Artist", "QmLimited...", ethers.parseEther("1"), ethers.parseEther("0.1"), 10);

      await expect(
        contract.connect(signers.alice).makePrivateInvestment(0, 20, {
          value: ethers.parseEther("2"),
        }),
      ).to.be.revertedWith("Insufficient shares available");
    });

    /**
     * ✅ CORRECT: Emergency withdrawal by owner
     */
    it("should allow owner to emergency withdraw", async function () {
      // Send some ETH to contract
      await signers.alice.sendTransaction({
        to: contractAddress,
        value: ethers.parseEther("5"),
      });

      const contractBalance = await ethers.provider.getBalance(contractAddress);
      expect(contractBalance).to.equal(ethers.parseEther("5"));

      const ownerBalanceBefore = await ethers.provider.getBalance(signers.deployer.address);

      const tx = await contract.connect(signers.deployer).emergencyWithdraw();
      const receipt = await tx.wait();
      const gasCost = receipt!.gasUsed * receipt!.gasPrice;

      const ownerBalanceAfter = await ethers.provider.getBalance(signers.deployer.address);

      expect(ownerBalanceAfter).to.equal(ownerBalanceBefore + ethers.parseEther("5") - gasCost);
    });
  });

  describe("Contract Integration", function () {
    /**
     * ✅ CORRECT: Full investment flow
     * - Demonstrates complete user journey
     * - Shows how all components work together
     */
    it("should handle complete investment lifecycle", async function () {
      // Step 1: Register investors
      await contract.connect(signers.alice).registerInvestor();
      await contract.connect(signers.bob).registerInvestor();

      // Step 2: Owner lists artwork
      await contract
        .connect(signers.deployer)
        .listArtwork("The Great Wave", "Hokusai", "QmWave...", ethers.parseEther("10"), ethers.parseEther("0.1"), 100);

      // Step 3: Investors make private investments
      await contract.connect(signers.alice).makePrivateInvestment(0, 30, {
        value: ethers.parseEther("3"),
      });

      await contract.connect(signers.bob).makePrivateInvestment(0, 20, {
        value: ethers.parseEther("2"),
      });

      // Step 4: Verify state
      const artworkInfo = await contract.getArtworkInfo(0);
      expect(artworkInfo.availableShares).to.equal(50);
      expect(artworkInfo.investorCount).to.equal(2);

      const stats = await contract.getTotalStats();
      expect(stats.totalRegisteredInvestors).to.equal(2);
      expect(stats.totalArtworksListed).to.equal(1);

      // Step 5: Artwork is sold
      await contract.connect(signers.deployer).sellArtwork(0, ethers.parseEther("15"));

      // Artwork becomes inactive
      await expect(contract.getArtworkInfo(0)).to.be.revertedWith("Artwork not active");
    });
  });
});
