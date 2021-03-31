# TLDClaims

TLDClaims is a contract that can be added as a controller of the ENS root to allow TLD operators to claim their TLD in ENS without immediately disabling other integrations such as DNSSEC. Once the name is issued, it becomes a standard ERC721 NFT token, and can be transferred as normal; the owner of the token can then 'claim' the name on the ENS registry by transferring its ownership there to an address of their choice.

## Verifying

To verify the deployment of TLDToken on mainnet matches the code and constructor data in this repository:

```
npm install
npx hardhat --network mainnet run scripts/verify.js
```
