const ethers = require('ethers');
const fs = require('fs');
require('dotenv').config();

function loadABI(path) {
  const raw = fs.readFileSync(path, 'utf-8');
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : parsed.abi;
}

const contractAAbi = loadABI('./contractABI/validator.json');
const provider = new ethers.JsonRpcProvider('https://rpc.test2.btcs.network/', { 
  name: "Core Blockchain Testnet2",
  chainId: 1114
});

const contract = new ethers.Contract(
  '0xe60b1F8ec572f9B00f1210eA6BeF67b11bC65De9',
  contractAAbi,
  new ethers.Wallet(process.env.PRIVATEKEY, provider)
);

module.exports = contract;
``