// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

// V1 - Buyer will buy property directly

// V2 - Buyer will reserve property and need to make a payment with 3 days.
// Declare contract
contract Escrow is Ownable {

    enum Status {
        NEW,
        // PAID,
        BOOKED,
        COMPLETED
        // CANCEL
    }

    uint public totalProperties;
    
    struct Property {
        string roomType;
        uint price;
        Status currentStatus;
        uint deposit;
        address owner;
    }
    
    mapping (uint => Property) public properties;
    
    constructor() {
        totalProperties = 0;
    }
    
    // Currently is 1 wei
    modifier isFullDeposit(uint id) {
        require( msg.value == properties[id].price, "Please pay the full deposit at one go");
        _;
    }
    
    event PropertyCreated(uint id);
    
    event DepositCompleted(uint id, address owner, uint deposit);
    
    event PropertyBooked(uint id);
    
    function createProperty(string memory _roomType, uint _price) public onlyOwner {
        // Check property don't exisit, check mapping count
       totalProperties ++;
       properties[totalProperties] = Property(_roomType,  _price, Status.NEW, 0, msg.sender );
       emit PropertyCreated(totalProperties);
    }
    

    // Check if status is NEW
    // Check if payment is made in full
    function payDeposit(uint _id) isFullDeposit(_id) public payable {
        require(_id >=1 && _id <= totalProperties, "No such unit for sale");
        require(properties[_id].currentStatus == Status.NEW, "Property Unit status is not New" );
        
        Property memory _property = properties[_id];
        _property.deposit = msg.value;
        _property.owner = msg.sender;
        _property.currentStatus = Status.BOOKED;
        properties[_id] = _property;
        emit DepositCompleted(_id, msg.sender, msg.value);
    }
    
    // Check if status is PROCESSING
    // TODO V2 Time-base to commplete the purchase, NFT
    function completeBooking(uint _id) public onlyOwner {
        require(properties[_id].currentStatus == Status.BOOKED, "Property is not booked");
        // TODO transfer ETH to Property developer's account
        Property memory _property = properties[_id];
        _property.currentStatus = Status.COMPLETED;
        properties[_id] = _property;
        emit PropertyBooked(_id);
    }
    // TODO transfer account balance to owner if status.COMPLETED

}