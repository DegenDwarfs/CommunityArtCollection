// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC1155D.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title ERC1155Mock
 * This mock just publicizes internal functions for testing purposes
 */
contract DDCAC is ERC1155 {
    
    using Counters for Counters.Counter;

    /// @notice Counter for number of mints
    Counters.Counter public _tokenIds;

    constructor(string memory uri) ERC1155(uri) {}

    function setURI(string memory newuri) public {
        _setURI(newuri);
    }

    function mint(
        address to
    ) public {
        _tokenIds.increment();
        _mint(to, _tokenIds.current(), 1, '');
    }

    function burn(
        address owner,
        uint256 id,
        uint256 value
    ) public {
        _burn(owner, id, value);
    }

    function burnBatch(
        address owner,
        uint256[] memory ids,
        uint256[] memory values
    ) public {
        _burnBatch(owner, ids, values);
    }
}