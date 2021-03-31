const { ethers } = require("hardhat");
const hre = require("hardhat");
const { getDeploymentData } = require("./preloads");

async function main() {
    const TLDToken = await ethers.getContractFactory("TLDToken");
    const constructorArgs = await getDeploymentData();

    const tx = (await TLDToken.deploy(...constructorArgs)).deployTransaction;
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
