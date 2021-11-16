// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

// V1 - Buyer will buy property and pay full price directly

// Declare contract
contract Escrow {
    
    address[16] public owners;
    
    enum Status {
        PENDING,
        // PAID,
        PROCESSING,
        COMPLETE,
        CANCEL
    }
    
    Status public currentStatus;
    address public buyer;
    // Seller will deploy the smart contract
    address public seller;
    
    // uint public currentDateTime = block.timestamp;
    
    // modifier onlyBuyer(){
    //     require(msg.sender == buyer, "Only buyer can pay for this");
    //     _;
    // }
    
    // modifier onlySeller(){
    //     require(msg.sender == seller, "Only seller can process this");
    //     _;
    // }
    
    modifier checkStatus(Status expectedState) {
        require(currentStatus == expectedState);
        _;
    }
    
    // Run once to initialize the state of the contract
    constructor() {
        seller = msg.sender;
    }
    
    // Must have if you want to use Metamask to send ETH to this contract
    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
    
    // Get Balance of contract 
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
    
    event unitPurchased(uint unit);
    
    // 
    // function makePayment(uint _unit) checkStatus(Status.PENDING) external payable returns (uint){
        function makePayment(uint _unit) external payable returns (uint purchasedUnit){
        // require(currentStatus == Status.PENDING, "Deposited made by buyer");
        require(_unit >= 0 && _unit <= 15, "No such unit for sale");
        buyer = msg.sender;
        owners[_unit] = msg.sender;
        currentStatus = Status.PROCESSING;
        emit unitPurchased(_unit);
        return _unit;
    }
    
    function completePurchase() onlyOwner checkStatus(Status.PROCESSING) external payable{
        // require(currentStatus == Status.PROCESSING, "Waiting for Deposit");
        payable(seller).transfer(address(this).balance);
        currentStatus = Status.COMPLETE;
    }
    
    
//     function readableDateTime(uint _currentDateTime) public {
//         current = new Date(_currentDateTime * 1000);

//     }
}