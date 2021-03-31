const { ethers } = require("hardhat");
const hre = require("hardhat");
const { getDeploymentData, TLDTOKEN_TX_HASH } = require("./preloads");

async function main() {
    const TLDToken = await ethers.getContractFactory("TLDToken");

    const constructorArgs = await getDeploymentData();
    const txdata = TLDToken.getDeployTransaction(...constructorArgs);

    const tx = await ethers.provider.getTransaction(TLDTOKEN_TX_HASH);
    if(tx.data == txdata.data) {
        console.log(`TLDToken was deployed correctly at ${tx.creates}`);
    } else {
        console.log("Unable to verify deployment of TLDToken.");
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
