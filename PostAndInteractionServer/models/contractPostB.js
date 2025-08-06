const ethers = require('ethers')
const fs  = require('fs')
require('dotenv').config()
const contractBAbi  = JSON.stringify( fs.readFileSync('./contractABI/postB.json','utf-8') );
const provider  = new ethers.JsonRpcProvider('https://rpc.test2.btcs.network/', { 
    name:"Core Blockchain Testnet2",
    chainId:1114
})
const contract =  new ethers.Contract('0x4cE33CEc9Ea2b5e6C030F5fE4e4dfc8EFd407464',contractBAbi, new ethers.Wallet(process.env.PRIVATEKEY,provider));

module.exports = contract;

