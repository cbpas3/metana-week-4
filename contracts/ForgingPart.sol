// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

interface IForgeNFTs {
    function mint(address minter, uint256 id) external;
    function burn(address burner, uint256 id) external; 
}

contract ForgingPart  {
    address private constant TOKEN_CONTRACT_ADDRESS = 0x7986127F5c24151f9d2acE39F13a4160eed006a0;
    uint256 public constant RED = 0;
    uint256 public constant BLACK = 1;
    uint256 public constant BLUE = 2;
    uint256 public constant BROWN = 3;
    uint256 public constant GREEN = 4;
    uint256 public constant ORANGE = 5;
    uint256 public constant PINK = 6;
    mapping (address => uint256) public lastMint;

    function forge(uint256 id) external {
        if(id == RED || id == BLACK || id == BLUE ){
            lastMint[msg.sender] = block.timestamp;
            require(block.timestamp - lastMint[msg.sender] > 1 minutes,
            "ForgeNFTs: Not enough time has passed since the last mint.");
            IForgeNFTs(TOKEN_CONTRACT_ADDRESS).mint(msg.sender, id);
            
        }
        else if(id == BROWN){
            require(IERC1155(TOKEN_CONTRACT_ADDRESS)
            .balanceOf(msg.sender, RED)>0, "ForgeNFTs: Not enough Red tokens.");
            require(IERC1155(TOKEN_CONTRACT_ADDRESS)
            .balanceOf(msg.sender, BLACK)>0, "ForgeNFTs: Not enough Black tokens.");
            IForgeNFTs(TOKEN_CONTRACT_ADDRESS).burn(msg.sender,RED);
            IForgeNFTs(TOKEN_CONTRACT_ADDRESS).burn(msg.sender,BLACK);
            IForgeNFTs(TOKEN_CONTRACT_ADDRESS).mint(msg.sender, BROWN);
        }
        else if(id == GREEN){
            require(IERC1155(TOKEN_CONTRACT_ADDRESS)
            .balanceOf(msg.sender, BLUE)>0, "ForgeNFTs: Not enough Blue tokens.");
            require(IERC1155(TOKEN_CONTRACT_ADDRESS)
            .balanceOf(msg.sender, BLACK)>0, "ForgeNFTs: Not enough Black tokens.");
            IForgeNFTs(TOKEN_CONTRACT_ADDRESS).burn(msg.sender,BLUE);
            IForgeNFTs(TOKEN_CONTRACT_ADDRESS).burn(msg.sender,BLACK);
            IForgeNFTs(TOKEN_CONTRACT_ADDRESS).mint(msg.sender, GREEN);
        }
        else if(id == ORANGE){
            require(IERC1155(TOKEN_CONTRACT_ADDRESS)
            .balanceOf(msg.sender, BLUE)>0, "ForgeNFTs: Not enough Blue tokens.");
            require(IERC1155(TOKEN_CONTRACT_ADDRESS)
            .balanceOf(msg.sender, RED)>0, "ForgeNFTs: Not enough Red tokens.");
            IForgeNFTs(TOKEN_CONTRACT_ADDRESS).burn(msg.sender,BLUE);
            IForgeNFTs(TOKEN_CONTRACT_ADDRESS).burn(msg.sender,RED);
            IForgeNFTs(TOKEN_CONTRACT_ADDRESS).mint(msg.sender, ORANGE);
        }
        else if(id == PINK){
            require(IERC1155(TOKEN_CONTRACT_ADDRESS)
            .balanceOf(msg.sender, BLUE)>0, "ForgeNFTs: Not enough Blue tokens.");
            require(IERC1155(TOKEN_CONTRACT_ADDRESS)
            .balanceOf(msg.sender, RED)>0, "ForgeNFTs: Not enough Red tokens.");
            require(IERC1155(TOKEN_CONTRACT_ADDRESS)
            .balanceOf(msg.sender, BLACK)>0, "ForgeNFTs: Not enough Black tokens.");
            IForgeNFTs(TOKEN_CONTRACT_ADDRESS).burn(msg.sender,BLUE);
            IForgeNFTs(TOKEN_CONTRACT_ADDRESS).burn(msg.sender,RED);
            IForgeNFTs(TOKEN_CONTRACT_ADDRESS).burn(msg.sender,BLACK);
            IForgeNFTs(TOKEN_CONTRACT_ADDRESS).mint(msg.sender, PINK);
        } 
    }

    function trade(uint256 tradeIn, uint256 for_) external {
        require(IERC1155(TOKEN_CONTRACT_ADDRESS).balanceOf(msg.sender, tradeIn)>0, "ForgeNFTs: No token to trade in.");
        require(for_ < 3, "ForgeNFTs: You can't trade for those tokens.");
        IForgeNFTs(TOKEN_CONTRACT_ADDRESS).burn(msg.sender,tradeIn);
        IForgeNFTs(TOKEN_CONTRACT_ADDRESS).mint(msg.sender, for_);
    }

    function smelt(uint256 id) external {
        require(id > 2, "ForgeNFTs: You can't burn this token.");
        require(IERC1155(TOKEN_CONTRACT_ADDRESS).balanceOf(msg.sender, id)>0, "ForgeNFTs: No tokens to burn.");
        IForgeNFTs(TOKEN_CONTRACT_ADDRESS).burn(msg.sender,id);
    }

}