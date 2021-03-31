const { ethers } = require("hardhat");
const hre = require("hardhat");
const { getDeploymentData, TLDTOKEN_TX_HASH } = require("./preloads");

async function main() {
    const provider = (await ethers.getSigners())[0].provider;
    const txdata = await getDeploymentData();
    const tx = await provider.getTransaction(TLDTOKEN_TX_HASH);
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
