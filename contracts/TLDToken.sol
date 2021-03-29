pragma solidity ^0.8.0;

import "@ensdomains/root/contracts/Root.sol";
import "@ensdomains/root/contracts/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TLDToken is ERC721, Ownable {
    struct TokenInfo {
        string name;
        address owner;
        string image;
    }

    mapping(uint256=>string) public images;
    mapping(uint256=>string) public names;
    Root public root;

    constructor(address _root, TokenInfo[] memory preloads) ERC721("ENS Top-level domains", "TLD") {
        root = Root(_root);
        mintTLDs(preloads);
    }

    function mintTLDs(TokenInfo[] memory tlds) public onlyOwner {
        for(uint i = 0; i < tlds.length; i++) {
            TokenInfo memory tld = tlds[i];
            mintTLD(tld.name, tld.owner, tld.image);
        }
    }

    function mintTLD(string memory name, address owner, string memory image) public onlyOwner {
        uint256 tokenId = uint256(keccak256(bytes(name)));
        _mint(owner, tokenId);
        names[tokenId] = name;
        images[tokenId] = image;
    }

    function tokenURI(uint256 tokenId) public override view returns(string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return string(abi.encodePacked('data:application/json,{"name":".', names[tokenId], '", "image": "', images[tokenId], '"}'));
    }

    function setImage(uint256 tokenId, string calldata image) external {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "TLDToken: Not authorised to use token");
        images[tokenId] = image;
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
        delete names[tokenId];
        delete images[tokenId];
    }
}
