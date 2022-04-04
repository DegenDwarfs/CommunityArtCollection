<img src="https://github.com/DegenDwarfs/CommunityArtCollection/blob/main/images/commArt.png">
The Dwarf Community Art Collection.
Part of Roadmap Phase 1 - Admire the Art

- Each NFT(ERC-721) is an exclusive 1/1 donated by a community member.
- The Dwarf team gets the final say of what makes it into the collection.
- These NFTs are not to be sold by the team, they are to be given away as part of parties, contests, or roadmap events.
- Any community member can contribute, and the Dwarf art is fair use.
- ONLY Dwarf Holders qualify to receive these NFTs!
- They will be extremely limited to start (given we have not yet sold out) so as not to dilute the main collection.

# User Manual

### Minting
The `reward` function is used for minting, and it accepts 1 parameter (address) for the winner.
Only the contract owner can call this, and the NFT will be minted directly into the winners address.

### BaseURI
The baseURI is set during deployment and can be changed using the `setBaseURI` function. This function accepts 1 parameter (string)
for the URL of the baseURI. This contract concats `.json` at the end of the string, and this can be removed on [line 73](https://github.com/DegenDwarfs/CommunityArtCollection/blob/e511de346e98e353c7823ef3aabaa6da2e6ff836/contracts/DDCAC.sol#L73).

# Dev Manual

### Install Contract Dependecies

The first steps are to clone the repository and install its dependencies:

```sh
git clone https://github.com/stinkyfi/DegenDwarfs.git
cd DegenDwarfs
npm install
```

### Deploy
On a new terminal, go to the repository's root folder and run this to
deploy your contract:

```sh
npx hardhat run scripts/deploy.js --network <network>
```

### Verify
On a new terminal, go to the repository's root folder and run this to
deploy your contract:

```sh
npx hardhat verify --network <network> <contract_address> <"BaseURI String">
```
