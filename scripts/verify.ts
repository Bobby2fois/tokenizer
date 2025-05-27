import { run, ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const tokenAddress = "0x8b1B189190E4Bac00efB5e31134361E3c31122A4";
  const tokenName = "TokenTest42";
  const tokenSymbol = "TK42";
  const initialSupply = 42000000;
  
  // Owner addresses from .env file
  const ownerAddresses = [
    process.env.OWNER1_ADDRESS,
    process.env.OWNER2_ADDRESS,
    process.env.OWNER3_ADDRESS
  ];
  
  console.log("Verifying TestToken contract...");
  console.log("Token Address:", tokenAddress);
  console.log("Token Name:", tokenName);
  console.log("Token Symbol:", tokenSymbol);
  console.log("Initial Supply:", initialSupply);
  console.log("Owner Addresses:", ownerAddresses);
  
  try {
    await run("verify:verify", {
      address: tokenAddress,
      contract: "code/contracts/TestToken.sol:TestToken",
      constructorArguments: [
        tokenName,
        tokenSymbol,
        initialSupply,
        ownerAddresses
      ],
    });
    
    console.log("TestToken verification successful!");
    
    const token = await ethers.getContractAt("TestToken", tokenAddress);
    const multisigAddress = await token.multisig();
    
    console.log("\nVerifying MultiSig contract...");
    console.log("MultiSig Address:", multisigAddress);
    console.log("MultiSig Owners:", ownerAddresses);
    console.log("Required Confirmations: 2");
    
    await run("verify:verify", {
      address: multisigAddress,
      contract: "code/contracts/MultiSig.sol:MultiSig",
      constructorArguments: [
        ownerAddresses,
        2 // Required confirmations (2/3)
      ],
    });
    
    console.log("MultiSig verification successful!");
  } catch (error) {
    console.error("Verification failed:", error);
  }
}

main().catch(console.error);