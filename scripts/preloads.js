const { ethers } = require('hardhat');
const fetch = require('node-fetch');

const IPFS_URL = 'ipfs://QmWcV2zUyGRyqPosmRLbbjJRxrjPK6sCWJDsoqfvMStTo7';

const PRELOADS = [
    {name: 'audio', tokenURI: `${IPFS_URL}/audio.json`},
    {name: 'blackfriday', tokenURI: `${IPFS_URL}/blackfriday.json`},
    {name: 'christmas', tokenURI: `${IPFS_URL}/christmas.json`},
    {name: 'click', tokenURI: `${IPFS_URL}/click.json`},
    {name: 'diet', tokenURI: `${IPFS_URL}/diet.json`},
    {name: 'llp', tokenURI: `${IPFS_URL}/llp.json`},
    {name: 'flowers', tokenURI: `${IPFS_URL}/flowers.json`},
    {name: 'country', tokenURI: `${IPFS_URL}/country.json`},
    {name: 'game', tokenURI: `${IPFS_URL}/game.json`},
    {name: 'gift', tokenURI: `${IPFS_URL}/gift.json`},
    {name: 'guitars', tokenURI: `${IPFS_URL}/guitars.json`},
    {name: 'help', tokenURI: `${IPFS_URL}/help.json`},
    {name: 'hiphop', tokenURI: `${IPFS_URL}/hiphop.json`},
    {name: 'hosting', tokenURI: `${IPFS_URL}/hosting.json`},
    {name: 'hiv', tokenURI: `${IPFS_URL}/hiv.json`},
    {name: 'juegos', tokenURI: `${IPFS_URL}/juegos.json`},
    {name: 'link', tokenURI: `${IPFS_URL}/link.json`},
    {name: 'lol', tokenURI: `${IPFS_URL}/lol.json`},
    {name: 'mom', tokenURI: `${IPFS_URL}/mom.json`},
    {name: 'photo', tokenURI: `${IPFS_URL}/photo.json`},
    {name: 'pics', tokenURI: `${IPFS_URL}/pics.json`},
    {name: 'property', tokenURI: `${IPFS_URL}/property.json`},
    {name: 'sexy', tokenURI: `${IPFS_URL}/sexy.json`},
    {name: 'tattoo', tokenURI: `${IPFS_URL}/tattoo.json`},
    {name: 'trust', tokenURI: `${IPFS_URL}/trust.json`},
];

const ROOT_ADDRESS = "0xaB528d626EC275E3faD363fF1393A41F581c5897";
const MULTISIG_ADDRESS = "0xCF60916b6CB4753f58533808fA610FcbD4098Ec0";
const TLDTOKEN_TX_HASH = "0x6abf5aad25eeabc5da6dcd9dbd21e5905f238b3fe678887233cc61a616505962";

async function getAddress(tld) {
    const response = await fetch(`https://cloudflare-dns.com/dns-query?name=_ens.nic.${tld}&type=TXT&ct=application/dns-json`);
    const data = await response.json();
    for(let record of data.Answer) {
        for(let match of record.data.match("a=0x[0-9a-fA-F]{40}")) {
            return match.slice(2);
        }
    }
    return undefined;
}

async function getPreloads() {
    const addresses = await Promise.all(PRELOADS.map((p) => getAddress(p.name)));
    const preloads = PRELOADS.map((p, i) => Object.assign({owner: addresses[i]}, p));
    return preloads;
}

async function getDeploymentData() {
    const preloads = await getPreloads();
    return [ROOT_ADDRESS, preloads, MULTISIG_ADDRESS];
}

module.exports = { getDeploymentData, TLDTOKEN_TX_HASH };
