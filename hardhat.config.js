require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.2",
  networks: {
    test: {
      url: "http://localhost:8545/"
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/58a380d3ecd545b2b5b3dad5d2b18bf0",
      accounts: process.env['PRIVATE_KEY'] && [process.env["PRIVATE_KEY"]],
    }
  }
};
