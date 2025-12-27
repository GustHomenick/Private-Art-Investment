import { HardhatUserConfig } from "hardhat/config";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

/**
 * @title Accounts Task
 * @notice Display available accounts and balances in the current network
 * @dev Hardhat task for debugging and development purposes
 *
 * ## Usage:
 * ```bash
 * npx hardhat accounts
 * npx hardhat accounts --network sepolia
 * ```
 */

task("accounts", "Prints the list of accounts", async (args, hre: HardhatRuntimeEnvironment) => {
  const accounts = await hre.ethers.getSigners();

  console.log("\nAvailable Accounts:");
  console.log("==================\n");

  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    const balance = await hre.ethers.provider.getBalance(account.address);

    console.log(`Account ${i}: ${account.address}`);
    console.log(`Balance: ${hre.ethers.formatEther(balance)} ETH`);
    console.log();
  }
});
