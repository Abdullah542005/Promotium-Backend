const ethers = require('ethers')
const fs  = require('fs')
require('dotenv').config()
const contractAAbi  =  fs.readFileSync('./contractABI/postA.json','utf-8');
const provider  = new ethers.JsonRpcProvider( 'https://rpc.test2.btcs.network/',{ 
    name:"Core Blockchain Testnet2",
    chainId:1114
})
const contract =  new ethers.Contract('0xc785F52C0992aE729B7F48a532D0635d57Ba65e6',contractAAbi, new ethers.Wallet(process.env.PRIVATEKEY,provider));

module.exports = contract;

