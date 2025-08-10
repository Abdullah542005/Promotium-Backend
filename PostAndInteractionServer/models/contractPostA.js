const ethers = require('ethers')
const fs  = require('fs')
require('dotenv').config()
const contractAAbi  =  fs.readFileSync('./contractABI/postA.json','utf-8');
const provider  = new ethers.JsonRpcProvider( 'https://rpc.test2.btcs.network/',{ 
    name:"Core Blockchain Testnet2",
    chainId:1114
})
const contract =  new ethers.Contract('0x4d9605B05C559187A5EdFcBc7ff221dc0B5A9Ac0',contractAAbi, new ethers.Wallet(process.env.PRIVATEKEY,provider));

module.exports = contract;

