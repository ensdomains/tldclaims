require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.2",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    test: {
      url: "http://localhost:8545/"
    },
    goerli: {
      url: "https://goerli.infura.io/v3/58a380d3ecd545b2b5b3dad5d2b18bf0",
      accounts: process.env['PRIVATE_KEY'] && [process.env["PRIVATE_KEY"]],
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/58a380d3ecd545b2b5b3dad5d2b18bf0",
      accounts: process.env['PRIVATE_KEY'] && [process.env["PRIVATE_KEY"]],
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/58a380d3ecd545b2b5b3dad5d2b18bf0",
      accounts: process.env['PRIVATE_KEY'] && [process.env["PRIVATE_KEY"]],
    }
  }
};
