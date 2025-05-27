import { ethers } from "hardhat";
import type { TestToken, MultiSig } from "../typechain-types";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)));
  
  // Define multisig owners - we need 2/3 approvals
  const multisigOwners = [
    process.env.OWNER1_ADDRESS!,
    process.env.OWNER2_ADDRESS!,
    process.env.OWNER3_ADDRESS!
  ];
  
  console.log("Multisig owners:", multisigOwners);

  // Deploy Token with built-in multisig
  const TestTokenFactory = await ethers.getContractFactory("TestToken");
  const token = await TestTokenFactory.deploy(
    "TokenTest42",
    "TK42",
    42_000_000, // Initial supply
    multisigOwners // Owners for the 2/3 multisig
  );
  
  await token.waitForDeployment();
  
  // Get the address of the deployed token
  const tokenAddress = await token.getAddress();
  
  // Get the multisig address from the token contract
  const multisigAddress = await token.multisig();
  
  console.log("Token deployed to:", tokenAddress);
  console.log("Multisig deployed to:", multisigAddress);
  console.log("\nDeployment complete! The TestToken is now using a 2/3 multisig for transfers over 100k tokens.");
  
  // Verify the threshold
  const threshold = await token.THRESHOLD();
  console.log(`Transfer threshold for multisig approval: ${ethers.formatEther(threshold)} tokens`);
  
  // To verify on BSC Testnet explorer, use:
  console.log("\nTo verify contracts on BSC Testnet Explorer:");
  console.log(`npx hardhat verify --network bsctest ${tokenAddress} "Token42" "TK42" 42000000 [${multisigOwners.join(', ')}]`);
}

main().catch(console.error);