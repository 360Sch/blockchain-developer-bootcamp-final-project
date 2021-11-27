let BN = web3.utils.BN;
let Escrow = artifacts.require("Escrow");
// let { catchRevert } = require("./exceptionsHelpers.js");
const { items: ItemStruct, isDefined, isPayable, isType } = require("./ast-helper");

contract("Escrow", function (accounts) {
    const [_owner, buyer] = accounts;
    const emptyAddress = "0x0000000000000000000000000000000000000000";

    beforeEach(async() =>{
        instance = await Escrow.new();
    })

    describr("Variable", () => {
        it("should have an owner", async () =>{
            assert.equal(typeof instance.ower, 'function',"the contract has no owner");
        })
    });

});

// test only owner can create property
// check property count is valid after property creation
// test use can book property
// test unit must be available for booking
// test unit is New and not in processing state
// test deposit must be made in full