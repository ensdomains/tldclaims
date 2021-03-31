pragma solidity ^0.8.0;

import "@ensdomains/root/contracts/Root.sol";
import "@ensdomains/root/contracts/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract TLDToken is ERC721, ERC721URIStorage, Ownable {
    struct TokenInfo {
        string name;
        address owner;
        string tokenURI;
    }

    Root public root;

    constructor(address _root, TokenInfo[] memory preloads, address _owner) ERC721("ENS Top-level domains", "TLD") {
        root = Root(_root);
        mintTLDs(preloads);
        transferOwnership(_owner);
    }

    function mintTLDs(TokenInfo[] memory tlds) public {
        for(uint i = 0; i < tlds.length; i++) {
            TokenInfo memory tld = tlds[i];
            mintTLD(tld.name, tld.owner, tld.tokenURI);
        }
    }

    function mintTLD(string memory name, address owner, string memory tokenURI) public onlyOwner {
        uint256 tokenId = uint256(keccak256(bytes(name)));
        _mint(owner, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    function claim(uint256 tokenId, address ensowner) external {
        // Safety check: Do not allow .eth to be changed this way
        require(_isApprovedOrOwner(_msgSender(), tokenId), "TLDToken: Not authorised to use token");
        require(tokenId != uint256(keccak256('eth')), "TLDToken: Cannot change .eth");
        root.setSubnodeOwner(bytes32(tokenId), ensowner);
    }

    function burn(uint256 tokenId) external {
        require(_isApprovedOrOwner(_msgSender(), tokenId) || isOwner(_msgSender()),
            "TLDToken: Only token or contract owner can call burn");
        _burn(tokenId);
    }

    function _burn(uint256 tokenId) internal virtual override(ERC721URIStorage, ERC721) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view virtual override(ERC721URIStorage, ERC721) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
