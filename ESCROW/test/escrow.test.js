const Escrow = artifacts.require("Escrow");

/*
 * Did the bare minimun unit test so I can complete the project on time
 * 
 */

const ERR_NOT_OWNER = "Ownable: caller is not the owner";
const ERR_NOT_EXACT_AMOUNT = "Please pay the full deposit at one go"

const getErrorObj = (obj = {}) => {
  const txHash = Object.keys(obj)[0];
  return obj[txHash];
};

const createProperty = async (instance, tx = {}) => {
  await instance.createProperty('1','1000000000');
}


contract("Escrow", function (accounts) {
  const [owner, buyer] = accounts;

  let instance;
  
  // Create contract before each test
  beforeEach(async() =>{
      instance = await Escrow.new();
  })

  //Check contract inherits OpenZeppeln Ownable 
  describe("Ownable", () => {
    it("should add first account as owner using OpenZeppelin Ownable", async () => {
      assert.strictEqual(await instance.owner(), owner);
    });
  });

  // Check variables are declared
  describe("Variable", () => {
    it("should assert true", async () => {
      return assert.isTrue(true);
    });

    it("should have an totalProperties", async () => {
      assert.equal(typeof instance.totalProperties, 'function', "has no totalProperties");
    });
    
    describe("Enum State", async () => {
      let enumStatus;
      before (()=>{
        enumStatus = Escrow.enums.Status;
        assert(enumStatus, "Should define an Enum called Status");
      });
    
      it("should define `NEW`", () => {
        assert(enumStatus.hasOwnProperty('NEW'),"has no 'NEW' status ");
      });
      it("should define `BOOKED`", () => {
        assert(enumStatus.hasOwnProperty('BOOKED'),"has no 'BOOKED' status ");
      });
      it("should define `COMPLETED`", () => {
        assert(enumStatus.hasOwnProperty('COMPLETED'),"has no 'COMPLETED' status ");
      });
    });

    // In future
    describe("Property Struct", async () => {
    })
  });

  describe("Create Property", async () => {
    it("should allow only the owner to create properties", async () => {
      try {
        // await createProperty()
        await instance.createProperty('1','1000000000', { from: buyer });
      } catch (e) {
        const { error, reason } = getErrorObj(e.data);
        assert.equal(error, "revert");
        assert.equal(reason, ERR_NOT_OWNER);
      }
    })

  //  it("should add a property with ther right values", async () => {
  //   const property = await instance.properties.call(1);
  //   assert.equal(
  //      property[0],
  //      '1',
  //      "the property does not match the expected value");
  //   });
  });

  describe("Pay Deposit", async () => {
   
    it("should fail if downpayment deposit is not exact", async() => {
      await instance.createProperty('1','1000000000', { from: owner });
      // const property = await instance.properties.call(1);  
      try {
        await instance.payDeposit(1, {value: web3.utils.toWei("0.15")});
      } catch(e){
        const { error, reason } = getErrorObj(e.data);
        // assert.equal(error, "revert");
        assert.equal(reason, ERR_NOT_EXACT_AMOUNT);
      }
    });
  });
  
  describe("Complete Booking", async () => {
    it("should allow only the owner to complete the booking", async () => {
      await instance.createProperty('1','1000000000', { from: owner });
      try {
        await instance.completeBooking(1, {from: buyer});
      } catch (e) {
        const { error, reason } = getErrorObj(e.data);
        // assert.equal(error, "revert");
        assert.equal(reason, ERR_NOT_OWNER);
      }
    });
   
  });

});
