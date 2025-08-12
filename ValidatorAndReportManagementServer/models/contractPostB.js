const ethers = require('ethers')
const fs  = require('fs')
require('dotenv').config()
const contractAAbi  =  fs.readFileSync('./contractABI/postB.json','utf-8');
const provider  = new ethers.JsonRpcProvider('https://rpc.test2.btcs.network/', { 
    name:"Core Blockchain Testnet2",
    chainId:1114
})
const contract =  new ethers.Contract('0x7293c154e9Ab2cd9C209f4E9d26015d1536dD6F2',contractAAbi, new ethers.Wallet(process.env.PRIVATEKEY,provider));

module.exports = contract;

