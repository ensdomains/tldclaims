const { expect } = require("chai");
const { ethers } = require("hardhat");
const namehash = require("eth-ens-namehash");

const PRELOADS = [
    {name: 'diet', image: 'https://picsum.photos/700'},
];

function getTokenId(name) {
    return ethers.utils.keccak256(Buffer.from(name));
}

describe("TLDToken", () => {
    let TLDToken, Root, ENS;
    let token, tokenOwner, root, ens, signers;
    
    before(async () => {
        signers = await ethers.getSigners();
        TLDToken = await ethers.getContractFactory("TLDToken");
        Root = await ethers.getContractFactory("Root");
        ENS = await ethers.getContractFactory("ENSRegistry");
    });

    beforeEach(async () => {
        ens = await ENS.deploy();
        await ens.deployed();
        root = await Root.deploy(ens.address);
        await root.deployed();
        await ens.setOwner('0x' + '00'.repeat(32), root.address);
        token = await TLDToken.deploy(root.address, PRELOADS.map((p) => Object.assign({owner: signers[1].address}, p)), signers[0].address);
        await token.deployed();
        await root.setController(token.address, true);
        tokenOwner = token.connect(signers[1]);
    });

    describe("constructor", () => {
        it("should premint tokens passed to the constructor", async () => {
            for(let preload of PRELOADS) {
                const node = getTokenId(preload.name);
                expect(await token.ownerOf(node)).to.equal(signers[1].address);
                expect(await token.names(node)).to.equal(preload.name);
                expect(await token.images(node)).to.equal(preload.image);
            }
        });

        it("should set name and symbol", async () => {
            expect(await token.name()).to.equal("ENS Top-level domains");
            expect(await token.symbol()).to.equal("TLD");
        });

        it("should set the contract owner", async () => {
            expect(await token.owner()).to.equal(signers[0].address);
        });
    });

    describe("mintTLDs", () => {
        it("should allow the owner to create tokens", async () => {
            await expect(token.mintTLD('link', signers[1].address, 'https://picsum.photos/700'))
                .to.emit(token, 'Transfer')
                .withArgs(
                    '0x0000000000000000000000000000000000000000',
                    signers[1].address,
                    getTokenId('link'));
        });

        it("should not allow anyone else to create tokens", async () => {
            const tokenNonOwner = token.connect(signers[2]);
            await expect(tokenNonOwner.mintTLD('link', signers[2].address, 'https://picsum.photos/700'))
                .to.be.reverted;
        });

        it("should not allow minting a token that already exists", async () => {
            await token.mintTLD('test', signers[1].address, 'https://picsum.photos/700');
            await expect(token.mintTLD('test', signers[1].address, 'https://picsum.photos/700'))
                .to.be.reverted;
        });
    });

    describe("tokenURI", () => {
        it("should return a data URI for existing tokens", async () => {
            for(const preload of PRELOADS) {
                const uri = await token.tokenURI(getTokenId(preload.name));
                expect(uri).to.match(/^data:application\/json,/);
                const metadata = JSON.parse(uri.slice(22));
                expect(metadata).to.deep.equal({
                    name: "." + preload.name,
                    image: preload.image
                });
            }
        });

        it("should throw if called with a nonexistent token", async () => {
            await expect(token.tokenURI(getTokenId("foo")))
                .to.be.reverted;
        });
    });

    describe("setImage", () => {
        it("should update a token's image", async () => {
            const id = getTokenId(PRELOADS[0].name);
            await tokenOwner.setImage(id, "https://example.com/");
            expect(await token.images(id)).to.equal("https://example.com/");
            expect(await token.tokenURI(id)).to.match(/https:\/\/example.com\//);
        });

        it("should allow an approved account to update the token's image", async () => {
            const id = getTokenId(PRELOADS[0].name);
            await tokenOwner.setApprovalForAll(signers[2].address, true);
            const token2 = token.connect(signers[2]);
            await token2.setImage(id, "https://example.com/");
            expect(await token.images(id)).to.equal("https://example.com/");
            expect(await token.tokenURI(id)).to.match(/https:\/\/example.com\//);
        });

        it("should not allow anyone else update a token's image", async () => {
            const token2 = token.connect(signers[2]);
            const id = getTokenId(PRELOADS[0].name);
            await expect(token2.setImage(id, "https://example.com/")).to.be.reverted;
        });
    });

    describe("claim", () => {
        it("should allow the token owner to claim on the registry", async () => {
            for(const preload of PRELOADS) {
                const id = getTokenId(preload.name);
                await tokenOwner.claim(id, signers[2].address)
                const node = namehash.hash(preload.name);
                expect(await ens.owner(node)).to.equal(signers[2].address);
            }
        });

        it("should allow an approved account to claim on the registry", async () => {
            const id = getTokenId(PRELOADS[0].name);
            await tokenOwner.setApprovalForAll(signers[2].address, true);
            const token2 = token.connect(signers[2]);
            await token2.claim(id, signers[2].address);
            const node = namehash.hash(PRELOADS[0].name);
            expect(await ens.owner(node)).to.equal(signers[2].address);
        });

        it("should not allow any other account to claim on the registry", async () => {
            await expect(token.claim(getTokenId(PRELOADS[0].name), signers[0].address)).to.be.reverted;
        });

        it("should not allow .eth to be claimed even if it's issued", async () => {
            await token.mintTLD('eth', signers[1].address, 'https://picsum.photos/700');
            await expect(tokenOwner.claim(getTokenId('eth'), signers[2].address)).to.be.revertedWith("TLDToken: Cannot change .eth");
        });
    });

    describe("burn", () => {
        it("should allow the token owner to burn their token", async () => {
            for(let preload of PRELOADS) {
                const id = getTokenId(preload.name);
                await tokenOwner.burn(id);
                await expect(token.ownerOf(id)).to.be.reverted;
            }
        });

        it("should allow an approved account to burn a token", async () => {
            const id = getTokenId(PRELOADS[0].name);
            await tokenOwner.setApprovalForAll(signers[2].address, true);
            const token2 = token.connect(signers[2]);
            await token2.burn(id);
            await expect(token.ownerOf(id)).to.be.reverted;
        });

        it("should allow the contract owner to burn any token", async () => {
            for(let preload of PRELOADS) {
                const id = getTokenId(preload.name);
                await token.burn(id);
                await expect(token.ownerOf(id)).to.be.reverted;
            }
        });

        it("should not allow anyone else to burn tokens", async () => {
            const id = getTokenId(PRELOADS[0].name);
            const token2 = token.connect(signers[2]);
            await expect(token2.burn(id)).to.be.reverted;
        });

        it("should allow minting a token that has been burned", async () => {
            const id = getTokenId(PRELOADS[0].name);
            await token.burn(id);
            await expect(token.mintTLD(PRELOADS[0].name, signers[1].address, PRELOADS[0].image))
                .to.emit(token, 'Transfer');
        });
    });
});
