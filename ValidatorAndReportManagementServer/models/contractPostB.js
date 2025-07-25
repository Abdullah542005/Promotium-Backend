const ethers = require('ethers')
const fs  = require('fs')
require('dotenv').config()
const contractAAbi  =  fs.readFileSync('./contractABI/postB.json','utf-8');
const provider  = new ethers.JsonRpcApiProvider( { 
    name:"Core Blockchain Testnet2",
    chainId:1114
},'https://rpc.test2.btcs.network/')
const contract =  new ethers.Contract('0xD4ADeb29b96229F25ab200f2DC4f500002d6317a',contractAAbi, new ethers.Wallet(process.env.PRIVATEKEY,provider));

module.exports = contract;

