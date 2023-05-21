const mongoose =require("mongoose");

const employ = new mongoose.Schema({
    Email : {
        type:String,
        required:true,
        unique:true
    },
    Password_u : {
        type:String,
        required:true
    },
    conf : {
        type:String,
        required:true
    }
})

const signup1 = new mongoose.model("Signup" , employ)

module.exports = signup1;