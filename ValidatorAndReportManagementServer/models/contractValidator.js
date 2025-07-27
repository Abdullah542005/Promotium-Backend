const ethers = require('ethers')
const fs  = require('fs')
require('dotenv').config()
const contractAAbi  =  fs.readFileSync('./contractABI/validator.json','utf-8');
const provider  = new ethers.JsonRpcApiProvider( { 
    name:"Core Blockchain Testnet2",
    chainId:1114
},'https://rpc.test2.btcs.network/')
const contract =  new ethers.Contract('0x3aE9C0baCB32d9d4Eda62158E78DA55C3E1ef4C1',contractAAbi, new ethers.Wallet(process.env.PRIVATEKEY,provider));

module.exports = contract;

