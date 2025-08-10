const ethers = require('ethers')
const fs  = require('fs')
require('dotenv').config()
const contractBAbi  = JSON.stringify( fs.readFileSync('./contractABI/postB.json','utf-8') );
const provider  = new ethers.JsonRpcProvider('https://rpc.test2.btcs.network/', { 
    name:"Core Blockchain Testnet2",
    chainId:1114
})
const contract =  new ethers.Contract('0x8b1443B4Fc488a08e9D7083c18576D5ad900887f',contractBAbi, new ethers.Wallet(process.env.PRIVATEKEY,provider));

module.exports = contract;

