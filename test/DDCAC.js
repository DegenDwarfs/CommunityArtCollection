// This is an exmaple test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
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

  let NFT;
  let DDCAC;
  let ERC20;
  let Token;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let provider;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    provider = waffle.provider;
    // Get the ContractFactory and Signers here.
    NFT = await ethers.getContractFactory("CommunityArtCollection");
    ERC20 = await ethers.getContractFactory("TEST");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    

    // To deploy our contract, we just have to call NFT.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    DDCAC = await NFT.deploy("https://assets.degendwarfs.io/artcollection/json/");
    Token = await ERC20.deploy(owner.address, ethers.utils.parseEther("100"));

    // We can interact with the contract by calling `DDCAC.method()`
    await DDCAC.deployed();
    await Token.deployed();

    await Token.increaseAllowance(DDCAC.address, ethers.utils.parseEther("10"));
  });

  describe("Deployment", function () {
    it("Verify Address Owner", async function () {
      expect(await DDCAC.owner()).to.equal(owner.address);
    });

    it("Verify $TEST allowance equals 10", async function () {
      expect(await Token.allowance(owner.address, DDCAC.address)).to.equal(ethers.utils.parseEther("10"));
    });

    it("Verify $DDCAC supply is 0", async function () {
      expect(await DDCAC.totalSupply()).to.equal(0);
    });

  });

  describe("Mint", function () {

    it("Verify Supply equals 0", async function () {
      let supply = await DDCAC.totalSupply();
      expect(supply).to.be.equal(0);

    });

    it("Mint Token", async function () {
      mint(addr1.address, addr2.address);
    });

    it("Verify Supply equals 1", async function () {
      mint(addr1.address, addr2.address);
      supply = await DDCAC.totalSupply();
      expect(supply).to.be.equal(1);
      let nftOwner = await DDCAC.ownerOf(0);
      expect(nftOwner).to.equal(addr1.address);
    });


    it("Verify addr1 owns NFT #0", async function () {
      mint(addr1.address, addr2.address);
      supply = await DDCAC.totalSupply();
      expect(supply).to.be.equal(1);
      let nftOwner = await DDCAC.ownerOf(0);
      expect(nftOwner).to.equal(addr1.address);
      nftOwner = await DDCAC.ownerOf(0);
      expect(nftOwner).to.equal(addr1.address);
    });


  });

  describe("Gas Token Donation", function () {

    it("Verify Starting Balance", async function () {
      //Check Gas Token Balances
      let donorBalance = await provider.getBalance(addr1.address);
      let artistBalance = await provider.getBalance(addr2.address);
      expect(donorBalance).to.equal(ethers.utils.parseEther("10000"));
      expect(artistBalance).to.equal(ethers.utils.parseEther("10000"));
    });

    it("Donate Tokens", async function () {
      mint(addr1.address, addr2.address);
      //Call Artist Donation
      let overrides = {value: ethers.utils.parseEther("1")};
      await DDCAC.artistDonation(0, overrides);
    });

    it("Verify Final Balance", async function () {
      mint(addr1.address, addr2.address);
      expect(await DDCAC.totalSupply()).to.equal(1);
      let overrides = {value: ethers.utils.parseEther("1")};
      await DDCAC.artistDonation(0, overrides);
      //Verify the Address Balance after test
      expect(await provider.getBalance(addr2.address)).to.equal(ethers.utils.parseEther("10001"));
    });

  });

  // describe("ERC-20 Token Donation", function () {
  //   it("Mint, Check Allownace, Call Function, Verify Balance", async function () {
  //     //Mint Token
  //     mint(addr1.address, addr2.address);
  //     //Check  Token Balances
  //     let donorBalance = await Token.balanceOf(owner.address);
  //     let artistBalance = await Token.balanceOf(addr2.address);
  //     expect(donorBalance).to.equal(ethers.utils.parseEther("100"));
  //     expect(artistBalance).to.equal(ethers.utils.parseEther("0"));
  //     let allownace = await Token.allowance(owner.address, DDCAC.address);
  //     expect(allownace).to.equal(ethers.utils.parseEther("10"));
  //     await DDCAC.artistTokenDonation(0, Token.address, ethers.utils.parseEther("5"));
  //     donorBalance = await Token.balanceOf(owner.address);
  //     expect(donorBalance).to.equal(ethers.utils.parseEther("1"));
  //     artistBalance = await Token.balanceOf(addr2.address);
  //     expect(artistBalance).to.equal(ethers.utils.parseEther("9"));
  //   });
  // });

  async function mint (winningAddress, artistAddress) {
      //Mint Token
      await DDCAC.reward(winningAddress, artistAddress);
  }

});