// This is an exmaple test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const BigNumber = require('bignumber.js');
// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` recieves the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("Degen Dwarfs Community Art Collection (DDCAC)", function () {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("CommunityArtCollection");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    hardhatToken = await Token.deploy("https://assets.degendwarfs.io/artcollection/json/");

    // We can interact with the contract by calling `hardhatToken.method()`
    await hardhatToken.deployed();
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      // Expect receives a value, and wraps it in an assertion objet. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });
  });

  describe("Mint", function () {
    it("Mint Token 0 directly to the winner", async function () {
      //Winner: addr1, Artist: addr2
      await hardhatToken.reward(addr1.address, addr2.address);
      const nftOwner = await hardhatToken.ownerOf(0);
      expect(nftOwner).to.equal(addr1.address);
    });

  });

  describe("Gas Token Donation", function () {
    it("Mint, Check Balance, Call Function, Verify Balance", async function () {
      const provider = waffle.provider;
      //Mint Token
      await hardhatToken.reward(addr1.address, addr2.address);
      //Check Gas Token Balances
      const donorBalance = await provider.getBalance(addr1.address);
      const artistBalance = await provider.getBalance(addr2.address);
      expect(donorBalance).to.equal(ethers.utils.parseEther("10000"));
      expect(artistBalance).to.equal(ethers.utils.parseEther("10000"));
      //Call Artist Donation
      const overrides = {value: ethers.utils.parseEther("1.0")};
      await hardhatToken.artistDonation(0, overrides);
      //Verify the Address Balance after test
      const artistTipped = await provider.getBalance(addr2.address);
      expect(artistTipped).to.equal(ethers.utils.parseEther("10001"));
    });

  });

});