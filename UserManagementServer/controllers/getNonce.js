let nonceList = [];
exports.getNonce = (req,res)=>{
    const userAddress = req.params.userAddress;
    if(!userAddress){
        return res.send("User Address in Required");
    }
        const nonce = Math.floor(100000 + Math.random() * 900000); // for random nonce (6 digits)
        const index = nonceList.findIndex(entry => entry.address === userAddress);
        if(index !== -1){
            nonceList[index].nonce = nonce;
        }else{
            nonceList.push({address: userAddress, nonce});
        }
        res.json({ nonce });
    };
    
    exports.nonceList = nonceList;
