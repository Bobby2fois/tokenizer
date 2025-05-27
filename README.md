## Technical choices
- **Tools**:
    - Hardhat (Typescript template)
    - OpenZeppelin (ERC20 implementation)

We took hardhat framework because it supports natively typescript and it has a lot of plugins to ease the deployment process (project structure, npx hardhat cmds, etc...)

Openzeppelin is a solidity library of secure smart contracts for all EVM-compatible blockchains. We use it to import the ERC20 token standard that handles _balances mapping, transfers, approvals and ownership.