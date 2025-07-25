const {nanoid} = require("nanoid")
exports.generateid = ()=>{
    return  nanoid(10);
}