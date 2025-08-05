const { ethers } = require('ethers');
const contract = require('../models/promo');
const waitList = []

exports.faucet = async (req,res)=>{
     const userAddress  = req.params.userAddress;
     try{
        if(!userAddress)
             return res.status(400).json({message:"User Address not defined"})
        const isWaiting = waitList.find((user)=>user.userAddress==userAddress)
        if(isWaiting){
            if((isWaiting.timestamp + 24*60*60)>Date.now()/1000)
              return res.status(400).json({message:"Can Request Once in 24 hours"})
            else 
                waitList.splice(waitList.indexOf(isWaiting),1)
        }
       
      const tx =  await contract.transfer(userAddress, ethers.parseUnits("50",18))
       const receipt = await tx.wait();
      if (receipt.status !== 1) {
          return res.status(400).json({ message: "Smart contract execution failed" });
      }

      waitList.push({userAddress:userAddress,timestamp:Date.now()/1000})
      
      res.status(200).json({ message: "Sucesss"});
       
     }catch(error){
        res.status(500).json({message:"Internal Server Error"})
        console.log(error.message);
     }
}