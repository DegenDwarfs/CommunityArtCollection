// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/*****************************************************************************************************
 ██████╗░███████╗░██████╗░███████╗███╗░░██╗  ██████╗░░██╗░░░░░░░██╗░█████╗░██████╗░███████╗░██████╗
 ██╔══██╗██╔════╝██╔════╝░██╔════╝████╗░██║  ██╔══██╗░██║░░██╗░░██║██╔══██╗██╔══██╗██╔════╝██╔════╝
 ██║░░██║█████╗░░██║░░██╗░█████╗░░██╔██╗██║  ██║░░██║░╚██╗████╗██╔╝███████║██████╔╝█████╗░░╚█████╗░
 ██║░░██║██╔══╝░░██║░░╚██╗██╔══╝░░██║╚████║  ██║░░██║░░████╔═████║░██╔══██║██╔══██╗██╔══╝░░░╚═══██╗
 ██████╔╝███████╗╚██████╔╝███████╗██║░╚███║  ██████╔╝░░╚██╔╝░╚██╔╝░██║░░██║██║░░██║██║░░░░░██████╔╝
 ╚═════╝░╚══════╝░╚═════╝░╚══════╝╚═╝░░╚══╝  ╚═════╝░░░░╚═╝░░░╚═╝░░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░░░░╚═════╝░
  Contract Developer: Stinky
  Description: Degen Dwarfs Community Art Collection includes exclusive 1/1's donated by 
               community members.
******************************************************************************************************/

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract DDCAC is ERC721, ERC721Enumerable, Ownable, Pausable {
    using Counters for Counters.Counter;

    /// @notice Counter for number of mints
    Counters.Counter public _tokenIds;
    /// @dev Base URI used for token metadata
    string private _baseTokenUri;

    struct Art {
        // Collection ID #
        uint256 id;
        // Winners Address
        address winner;
        // Address for Artist Donation
        address artistDonation;
        // Total Donations Raised
        uint256 totalDonations;
    }

    /// @dev Mapping of created character structs from token ID
    mapping(uint256 => Art) internal _collection;

    constructor(
        string memory _tokenURI
    ) ERC721("Degen Dwarfs Community Art Collection", "DDCAC") {
        _baseTokenUri = _tokenURI;
    }

    /*
     * @notice Mint a Degen Dwarf NFT
     * @param _winner Address of the winner    
     */    
    function reward(address _winner, address _artist) external whenNotPaused onlyOwner {        
        Art memory newArt;
        newArt.id = _tokenIds.current();
        newArt.winner = _winner;
        newArt.artistDonation = _artist;
        newArt.totalDonations = 0;
        _collection[newArt.id] = newArt;
        _safeMint(_winner,  _tokenIds.current());
        _tokenIds.increment();
    }

    /*
     * @notice Donate to Artist of a specific Art piece
     * @param _tokenId Address of the winner    
     */    
    function artistDonation(uint256 _tokenId) payable external {
        require(msg.value > 0, "Donations must be greater than 0");
        payable(_collection[_tokenId].artistDonation).transfer(msg.value);
    }

    /* @notice Pause Degen Dwarf minting */  
    function pauseMinting() external onlyOwner {
        _pause();
    }

    /* @notice Resume Degen Dwarf minting*/  
    function unpauseMinting() external onlyOwner {
        _unpause();
    }      

    // Internal functions

    /* @notice Returns the baseURI */      
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenUri;
    }

    // public functions

    /* @notice Returns an address array of winners */   
    function collectionPieces(uint256 _tokenId) public view returns(Art memory) {
        return _collection[_tokenId];
    }

    /*
     * @notice set the baseURI
     * @param baseURI
     */  
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenUri = baseURI;
    }      
    /* @notice Returns the baseURI */         
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return string(abi.encodePacked(_baseURI(), toString(tokenId), ".json"));
    }

    function toString(uint256 value) internal pure returns (string memory) {
    // Inspired by OraclizeAPI's implementation - MIT license
    // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol
        if (value == 0) {
            return "0";
        }

        uint256 temp = value;
        uint256 digits;

        while (temp != 0) {
            digits++;
            temp /= 10;
        }

        bytes memory buffer = new bytes(digits);

        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }

        return string(buffer);
    }    

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);

        // do stuff before every transfer
        // e.g. check that vote (other than when minted) 
        // being transferred to registered candidate
    }
    
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
        return
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
            super.supportsInterface(interfaceId);
    }    
}