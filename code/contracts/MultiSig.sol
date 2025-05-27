pragma solidity ^0.8.24;

contract MultiSig {
    struct Approval {
        address from;
        address to;
        uint256 amount;
        uint256 confirmations;
        bool executed;
    }
    
    mapping(bytes32 => Approval) public approvals; //Uses a hash as a key to store each transfer request
    address[] public owners; //Array of addresses that can approve transfers
    uint256 public required; //Number of confirmations required to execute a transfer

//Constructor initialize the contract with the list of owners (multisig approvers) and the number of confirmations required
    constructor(address[] memory _owners, uint256 _required) {
        owners = _owners;
        required = _required;
    }
    
    function approveTransfer(address from, address to, uint256 amount) external {
        bytes32 txHash = keccak256(abi.encode(from, to, amount)); //Creates a unique hash from the transaction details (sender, recipient, amount)
        require(!approvals[txHash].executed, "Already executed"); //Prevent double approvals
        
        approvals[txHash].confirmations++;
        if (approvals[txHash].confirmations >= required) { //Mark the transaction as executed if the required number of confirmations is reached
            approvals[txHash].executed = true;
        }
    }
    
    function isApproved(address from, address to, uint256 amount) //returns true if the transaction is fully approved
        external view returns (bool) 
    {
        bytes32 txHash = keccak256(abi.encode(from, to, amount));
        return approvals[txHash].executed;
    }
}