const {reportModel,userModel, postModel} = require("../models/dbModels");
exports.getReport = async (req,res)=>{ 
    const reportId  = req.params.reportId;
    try{
    if(!reportId){ 
         return res.status(404).json({ error: "Report Id Missing" });
    }
    const report = await reportModel.findById({_id:reportId}).lean();
    if(!report)
         return res.status(404).json({ error: "Report not found" });
    
    const post = await postModel.findById({_id:report.postId});

    return res.json({report:report,post:post})
  }
    catch(error){ 
        console.log(error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}