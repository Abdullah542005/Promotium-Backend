const ethers = require('ethers')
const fs  = require('fs')
require('dotenv').config()
const contractAAbi  =  fs.readFileSync('./contractABI/postB.json','utf-8');
const provider  = new ethers.JsonRpcProvider('https://rpc.test2.btcs.network/', { 
    name:"Core Blockchain Testnet2",
    chainId:1114
})
const contract =  new ethers.Contract('0xBA789D4B2538E4712C7Fe901Caf87Fe2439931a0',contractAAbi, new ethers.Wallet(process.env.PRIVATEKEY,provider));

module.exports = contract;

