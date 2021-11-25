// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Simple Escrow Contract to book and make a downpayment for a condominium
/// @author AdrianTeoYC
/// @notice You can use this contract if you like, it is not production-ready
/// @dev All function calls are currently implemented without side effects
/// @custom:experimental This is an experimental contract for my consensys blockchain bootcamp.
contract Escrow is Ownable {

    /// @dev Status of Property purchases 
    enum Status {
        NEW,
        BOOKED,
        COMPLETED
        // TODO V2: CANCEL
    }

    /// @notice Numnber of properties listed in the Contract
    /// @dev Used as a helper to iterate properties in the frontend
    uint public totalProperties;
    

    struct Property {
        string roomType;
        uint price;
        Status currentStatus;
        uint deposit;
        address owner;
    }
    
    /// @notice The properties' detail in the contract
    mapping (uint => Property) public properties;
    
    constructor() {
        totalProperties = 0;
    }
    
    /// @dev msg.value is in wei
    modifier isFullDeposit(uint id) {
        require( msg.value == properties[id].price, "Please pay the full deposit at one go");
        _;
    }
    
    /// @dev Emit event when a property is created in the contract
    event PropertyCreated(uint id);
    
    /// @dev Emit event when downpayment deposit is made for a property
    event DepositCompleted(uint id, address owner, uint deposit);
    
    /// @dev Emit event when contract owner verify and complete the booking of a property
    event PropertyBooked(uint id);
    
    /// @notice Creates a property listing
    /// @dev Allow only owner of contract to create a property
    /// @param _roomType is the number of bedrooms for this property
    /// @param _price is the price of this property in wei
    function createProperty(string memory _roomType, uint _price) public onlyOwner {
        // Check property don't exisit, check mapping count
       totalProperties ++;
       properties[totalProperties] = Property(_roomType,  _price, Status.NEW, 0, msg.sender );
       emit PropertyCreated(totalProperties);
    }
    
    /// @notice Buyer to make the downpayment deposit
    /// @dev Payable need to be made in full at one transaction with currentStatus as NEW
    /// @param _id propertyID
    
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
    
      // TODO V2 Time-base to commplete the purchase, NFT
    // Check if status is PROCESSING
    function completeBooking(uint _id) public onlyOwner {
        require(properties[_id].currentStatus == Status.BOOKED, "Property is not booked");
        // TODO transfer ETH to Property developer's account
        Property memory _property = properties[_id];
        _property.currentStatus = Status.COMPLETED;
        properties[_id] = _property;
        emit PropertyBooked(_id);
    }
    // TODO V2 transfer account balance to owner if status.COMPLETED

}