const ethers = require('ethers')
const fs  = require('fs')
require('dotenv').config()
const contractAAbi  =  fs.readFileSync('./contractABI/postB.json','utf-8');
const provider  = new ethers.JsonRpcProvider('https://rpc.test2.btcs.network/', { 
    name:"Core Blockchain Testnet2",
    chainId:1114
})
const contract =  new ethers.Contract('0xC93f1223bFd18Dc4170F4b6D7ef1Feb0B4Ce9E80',contractAAbi, new ethers.Wallet(process.env.PRIVATEKEY,provider));

module.exports = contract;

