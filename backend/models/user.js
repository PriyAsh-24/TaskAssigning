const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    name: {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password :{
        type : String,
        required : true,
    },
    isAdmin : {
        type : Boolean,
        default : false,
    },
    taskCompleted : {
        type : Number,
        default : 0,
    },
    taskGiven: [{ taskName: { type: mongoose.Schema.Types.ObjectId, ref: "tasks" } }],
},{timestamps : true});

const User=new mongoose.model('user',userSchema);

module.exports=User;