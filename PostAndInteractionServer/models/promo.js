const ethers = require('ethers')
const fs  = require('fs')
require('dotenv').config()
const erc20  = JSON.stringify( fs.readFileSync('./contractABI/erc20.json','utf-8') );
const provider  = new ethers.JsonRpcProvider('https://rpc.test2.btcs.network/', { 
    name:"Core Blockchain Testnet2",
    chainId:1114
})
const contract =  new ethers.Contract('0xbacE492619BaBcD20C7B88ce22e9C77c1fB68cF1',erc20, new ethers.Wallet(process.env.PRIVATEKEY,provider));

module.exports = contract;

