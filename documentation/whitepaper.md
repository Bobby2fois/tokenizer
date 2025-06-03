# TokenTest42 (TK42) Whitepaper

## Overview

TokenTest42 is an ERC20 token built on the Binance Smart Chain (BSC) Testnet that implements a multi-signature approval mechanism for large transfers. This security feature prevents unauthorized transfers of large token amounts by requiring approval from multiple designated owners.

## Token Specifications

- **Blockchain Network**: BSC Testnet
- **Name**: TokenTest42
- **Symbol**: TK42
- **Decimals**: 18
- **Initial Supply**: 42,000,000 TK42
- **Contract Address**: 0x9BB81D0F7E0144E13F9e365B2522ceA57e6535B9
- **MultiSig Address**: 0x712143a94ecE215cF9cb9ae6F35a52b92B9eC61d

## Key Features

### Standard ERC20 Functionality
- Full compliance with the ERC20 token standard
- Transferable tokens between any Ethereum addresses
- Support for standard token functions like `transfer`, `approve`, and `transferFrom`

### Ownership and Administration
- The contract creator (0xE8ee070E416f92A5b0f37438D33A97D246F72C0E) has administrative control
- The contract leverages OpenZeppelin's Ownable pattern for secure administration

### Security-Enhanced Transfers
- **Small Transfers**: Transfers up to 100,000 TK42 tokens work like standard ERC20 tokens
- **Large Transfers**: Transfers exceeding 100,000 TK42 require multi-signature approval

### Multi-Signature Protection
- The contract uses a 2-of-3 multi-signature mechanism for large transfers

## How to Use TokenTest42

### Requirements

- An Ethereum-compatible wallet (MetaMask, Trust Wallet, etc.)
- BSC Testnet configured in your wallet
- Testnet BNB for gas fees
- Basic understanding of blockchain transactions

### Small Transfers (Under 100,000 TK42)

Small transfers work like any standard ERC20 token:

1. Connect your wallet to BSC Testnet
2. Add the token to your wallet using the contract address
3. Initiate a transfer by specifying the recipient address and amount
4. Confirm and sign the transaction

### Large Transfers (Over 100,000 TK42)

Large transfers require a multi-step approval process:

1. **Request Approval**: An authorized multisig owner must request approval for the transfer
2. **Confirm Approval**: A second authorized owner must confirm the approval
3. **Execute Transfer**: Once approved, the sender can execute the transfer

## Multi-Signature Approval Process

### Step 1: Request Transfer Approval

To request approval for a large transfer, an authorized multisig owner must:

# Set environment variables
TOKEN_ADDRESS=0x9BB81D0F7E0144E13F9e365B2522ceA57e6535B9
MULTISIG_ADDRESS=0x712143a94ecE215cF9cb9ae6F35a52b92B9eC61d
SENDER_ADDRESS=<address-sending-tokens>
RECIPIENT_ADDRESS=<address-receiving-tokens>
AMOUNT=<amount-in-tokens>
OWNER_NUMBER=1  # Use 1, 2, or 3 depending on which owner is requesting

# Run the approval script
npx hardhat run scripts/approve-transfer.ts --network bsctest


### Step 2: Confirm Transfer Approval


# Set environment variables again
TOKEN_ADDRESS=0x9BB81D0F7E0144E13F9e365B2522ceA57e6535B9
MULTISIG_ADDRESS=0x712143a94ecE215cF9cb9ae6F35a52b92B9eC61d
SENDER_ADDRESS=<address-sending-tokens>
RECIPIENT_ADDRESS=<address-receiving-tokens>
AMOUNT=<amount-in-tokens>
OWNER_NUMBER=2  # A different owner from step 1

# Run the confirmation script
npx hardhat run scripts/approve-transfer.ts --network bsctest

### Step 3: Execute the Transfer

Once approved, the sender can execute the transfer using their wallet:

1. Connect to BSC Testnet with the sender's wallet
2. Initiate a transfer to the recipient address for the approved amount
3. The transaction will succeed if properly approved

## Technical Implementation

The token is built using:
- Hardhat development framework
- OpenZeppelin contract libraries
- Solidity version 0.8.24

The contract consists of two main components:
1. **TestToken.sol**: The main ERC20 token implementation with transfer overrides
2. **MultiSig.sol**: The multi-signature approval mechanism

## Authorized MultiSig Owners

1. 0xE8ee070E416f92A5b0f37438D33A97D246F72C0E
2. 0xE4bb6F9d7B72A501FCD2EEcfe9664EC67A0C6086
3. 0x4197b627Cd21fdfD9653b0180211D0059a266B6C

## Verification

The contract source code has been verified on BSCScan and can be viewed at:
- [Token Contract](https://testnet.bscscan.com/address/0x9BB81D0F7E0144E13F9e365B2522ceA57e6535B9)
- [MultiSig Contract](https://testnet.bscscan.com/address/0x712143a94ecE215cF9cb9ae6F35a52b92B9eC61d)