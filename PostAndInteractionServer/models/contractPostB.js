const ethers = require('ethers')
const fs  = require('fs')
require('dotenv').config()
const contractAAbi  = JSON.stringify( fs.readFileSync('./contractABI/postB.json','utf-8') );
const provider  = new ethers.JsonRpcApiProvider( { 
    name:"Core Blockchain Testnet2",
    chainId:1114
},'https://rpc.test2.btcs.network/')
const contract =  new ethers.Contract('0xBEdaD1eb06769a4B59920EBdA6d28754D41eCBd6',contractAAbi, new ethers.Wallet(process.env.PRIVATEKEY,provider));

module.exports = contract;

