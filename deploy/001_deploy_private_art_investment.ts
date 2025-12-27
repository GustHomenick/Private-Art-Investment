import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * @title PrivateArtInvestment Deployment
 * @notice Deployment script for the PrivateArtInvestment contract
 * @dev This script deploys the contract using hardhat-deploy pattern
 *
 * ## Deployment Features:
 * - Automated contract deployment
 * - Network-specific configuration
 * - Deployment verification support
 *
 * ## Usage:
 * ```bash
 * npx hardhat deploy --network localhost
 * npx hardhat deploy --network sepolia
 * ```
 */

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Deploying PrivateArtInvestment contract...");

  const deployment = await deploy("PrivateArtInvestment", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 1,
  });

  console.log(`PrivateArtInvestment deployed to: ${deployment.address}`);

  // Verify contract on Etherscan if not on local network
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations before verification...");
    // Wait a bit before attempting verification
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

func.tags = ["PrivateArtInvestment"];
export default func;
