pragma solidity ^0.8.0;

import "@ensdomains/root/contracts/Ownable.sol";
import "@ensdomains/root/contracts/Controllable.sol";

contract MockRoot is Ownable, Controllable {
    mapping(bytes32=>address) owners;

    function setSubnodeOwner(bytes32 label, address owner) external onlyController {
        owners[label] = owner;
    }
}