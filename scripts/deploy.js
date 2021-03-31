const { ethers } = require("hardhat");
const hre = require("hardhat");
const { getDeploymentData } = require("./preloads");

async function main() {
    const txdata = await getDeploymentData();
    const signers = await ethers.getSigners();
    const tx = await signers[0].sendTransaction(txdata);
    console.log(`Creation transaction sent with hash ${tx.hash}`);
    const receipt = await tx.wait();
    console.log("Transaction mined!");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
