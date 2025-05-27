pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MultiSig.sol";

contract TestToken is ERC20, Ownable { //Token will have ERC20 standard, and is ownable (adds ownership functionality for administrative control)
    MultiSig public multisig;
    uint256 public constant THRESHOLD = 100_000 * 10 ** 18; // token has 18 decimals, so it's represented as 10^18 base units
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address[] memory _owners // Multisig owners
    ) ERC20(name, symbol) Ownable(msg.sender) { //creation of the multisig contract with 2/3 approvals
        _mint(msg.sender, initialSupply * 10 ** decimals());
        multisig = new MultiSig(_owners, 2);
    }
    
    function transfer(address to, uint256 amount) public override returns (bool) { //override classic transfer function to add multisig approval
        if (amount > THRESHOLD) {
            require(
                multisig.isApproved(msg.sender, to, amount),
                "Multisig approval required"
            );
        }
        return super.transfer(to, amount); //we call the OpenZeppelin transfer function
    }
}
