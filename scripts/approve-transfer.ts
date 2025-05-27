import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

// This script allows any of the three multisig owners to approve a transaction
async function main() {

  const multisigAddress = process.env.MULTISIG_ADDRESS;
  const senderAddress = process.env.SENDER_ADDRESS;
  const recipientAddress = process.env.RECIPIENT_ADDRESS;
  const amountInTokens = process.env.AMOUNT;
  const ownerNumber = process.env.OWNER_NUMBER || "1"; // Default to first owner if not specified
  
  if (!multisigAddress || !senderAddress || !recipientAddress || !amountInTokens) {
    console.log("Error: Missing required environment variables");
    console.log("Usage: Set these environment variables before running:");
    console.log("  MULTISIG_ADDRESS=0x123... SENDER_ADDRESS=0xabc... RECIPIENT_ADDRESS=0xdef... AMOUNT=100000 OWNER_NUMBER=1 npx hardhat run scripts/approve-transfer.ts --network bsctest");
    return;
  }

  console.log(`Approving transfer of ${amountInTokens} tokens`);
  console.log(`From: ${senderAddress}`);
  console.log(`To: ${recipientAddress}`);
  
  // Parse the amount to wei (assuming 18 decimals)
  const amountInWei = ethers.parseEther(amountInTokens);
  
  // Get the correct owner based on owner_number
  let privateKey: string;
  if (ownerNumber === "1") {
    const key = process.env.PRIVATE_KEY;
    if (!key) {
      console.error("Please add PRIVATE_KEY to your .env file");
      return;
    }
    privateKey = key;
    console.log("Using OWNER1_ADDRESS as signer");
  } else if (ownerNumber === "2") {

    const key = process.env.PRIVATE_KEY2;
    if (!key) {
      console.error("Please add PRIVATE_KEY2 to your .env file");
      return;
    }
    privateKey = key;
    console.log("Using OWNER2_ADDRESS as signer");
  } else if (ownerNumber === "3") {

    const key = process.env.PRIVATE_KEY3;
    if (!key) {
      console.error("Please add PRIVATE_KEY3 to your .env file");
      return;
    }
    privateKey = key;
    console.log("Using OWNER3_ADDRESS as signer");
  } else {
    console.error("Invalid owner number. Must be 1, 2, or 3");
    return;
  }

  // Connect to the network
  const provider = new ethers.JsonRpcProvider(process.env.BSC_TESTNET_URL);
  
  // Create wallet with the selected private key
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log(`Connected with address: ${wallet.address}`);

  // Get the multisig contract
  const multisig = await ethers.getContractAt("MultiSig", multisigAddress, wallet);
  
  // Approve the transfer
  try {
    const tx = await multisig.approveTransfer(senderAddress, recipientAddress, amountInWei);
    console.log(`Transaction submitted: ${tx.hash}`);
    const receipt = await tx.wait();
    if (receipt) {
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    } else {
      console.log("Transaction was submitted but receipt could not be obtained");
      return;
    }
    
    // Check if the transfer is now fully approved
    const isApproved = await multisig.isApproved(senderAddress, recipientAddress, amountInWei);
    if (isApproved) {
      console.log("✅ The transfer is now fully approved and can be executed!");
    } else {
      console.log("⏳ The transfer needs more approvals before it can be executed.");
    }
    
  } catch (error) {
    console.error("Error approving transfer:", error);
  }
}

main().catch(console.error);