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
  '0x6E793c80d731fDbFA399690B03E43917b208C8dE',
  contractAAbi,
  new ethers.Wallet(process.env.PRIVATEKEY, provider)
);

module.exports = contract;
``