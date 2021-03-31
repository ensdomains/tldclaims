const { ethers } = require('hardhat');
const fetch = require('node-fetch');

const IPFS_URL = 'ipfs://QmVp4cEpTi6kM7touemhdcz9iPS1JjgpHAVVMwmNyQNQQa';

const PRELOADS = [
    {name: 'audio', image: `${IPFS_URL}/audio.png`},
    {name: 'blackfriday', image: `${IPFS_URL}/blackfriday.png`},
    {name: 'christmas', image: `${IPFS_URL}/christmas.png`},
    {name: 'click', image: `${IPFS_URL}/click.png`},
    {name: 'diet', image: `${IPFS_URL}/diet.png`},
    {name: 'llp', image: `${IPFS_URL}/llp.png`},
    {name: 'flowers', image: `${IPFS_URL}/flowers.png`},
    {name: 'country', image: `${IPFS_URL}/country.png`},
    {name: 'game', image: `${IPFS_URL}/game.png`},
    {name: 'gift', image: `${IPFS_URL}/gift.png`},
    {name: 'guitars', image: `${IPFS_URL}/guitars.png`},
    {name: 'help', image: `${IPFS_URL}/help.png`},
    {name: 'hiphop', image: `${IPFS_URL}/hiphop.png`},
    {name: 'hosting', image: `${IPFS_URL}/hosting.png`},
    {name: 'hiv', image: `${IPFS_URL}/hiv.png`},
    {name: 'juegos', image: `${IPFS_URL}/juegos.png`},
    {name: 'link', image: `${IPFS_URL}/link.png`},
    {name: 'lol', image: `${IPFS_URL}/lol.png`},
    {name: 'mom', image: `${IPFS_URL}/mom.png`},
    {name: 'photo', image: `${IPFS_URL}/photo.png`},
    {name: 'pics', image: `${IPFS_URL}/pics.png`},
    {name: 'property', image: `${IPFS_URL}/property.png`},
    {name: 'sexy', image: `${IPFS_URL}/sexy.png`},
    {name: 'tattoo', image: `${IPFS_URL}/tattoo.png`},
    {name: 'trust', image: `${IPFS_URL}/trust.png`},
];

const ROOT_ADDRESS = "0xaB528d626EC275E3faD363fF1393A41F581c5897";
const MULTISIG_ADDRESS = "0xCF60916b6CB4753f58533808fA610FcbD4098Ec0";
const TLDTOKEN_TX_HASH = "0x85a17536e5e0d43fb30e15e0453031a38cadf23fa24538405159431173ba2f0d";

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
