// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

// V1 - Buyer will buy property directly

// V2 - Buyer will reserve property and need to make a payment with 3 days.

// Declare contract
contract Escrow {
    
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
    
    modifier onlyBuyer(){
        require(msg.sender == buyer, "Only buyer can pay for this");
        _;
    }
    
    modifier onlySeller(){
        require(msg.sender == seller, "Only seller can process this");
        _;
    }
    
    modifier checkStatus(Status expectedState) {
        require(currentStatus == expectedState);
        _;
    }
    
    // Run once to initialize the state of the contract
    constructor() {
        seller = msg.sender;
    }
    
    // 
    function makePayment() checkStatus(Status.PENDING) external{
        // require(currentStatus == Status.PENDING, "Deposited made by buyer");
        buyer = msg.sender;
        currentStatus = Status.PROCESSING;
    }
    function completePurchase() onlySeller checkStatus(Status.PROCESSING) external payable{
        // require(currentStatus == Status.PROCESSING, "Waiting for Deposit");
        payable(seller).transfer(address(this).balance);
        currentStatus = Status.COMPLETE;
    }
    
    
//     function readableDateTime(uint _currentDateTime) public {
//         current = new Date(_currentDateTime * 1000);

//     }
}