// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";



contract ForgeNFTs is ERC1155 {
    uint256 public constant AMOUNT = 1;
    address private immutable _owner;
    bytes public constant DEFAULT_MESSAGE = "";
    
    mapping (address => bool) public allowedToMintDirectly;
    
    constructor() ERC1155("https://ipfs.io/ipfs/Qmf26APXuuGWee6GYJLvkJ4ZDsASdb7DQtqrysY6jEQ5z5/{id}") {
        _owner = msg.sender;
        allowedToMintDirectly[msg.sender] = true;
    }

    modifier authorizedAddressesOnly {
      require(allowedToMintDirectly[msg.sender], "ForgeNFTs: Unauthorized address.");
      _;
    }

    function allowToMintDirectly(address user) external {
        require(msg.sender == _owner, "ForgeNFTs: Unauthorized address.");
        allowedToMintDirectly[user] = true;
    }

    function mint(address minter, uint256 id) external authorizedAddressesOnly {
        _mint(minter, id, AMOUNT, DEFAULT_MESSAGE);
    }



    function burn(address burner, uint256 id) external authorizedAddressesOnly {
        _burn(burner, id, AMOUNT);
    }
}