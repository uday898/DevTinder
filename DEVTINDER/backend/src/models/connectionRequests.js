const { default: mongoose } = require("mongoose");
const moongoose = require("mongoose");
const User = require("./User");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: moongoose.Schema.Types.ObjectId,
        ref:User,
        required : true
    },
    toUserId:{
        type: moongoose.Schema.Types.ObjectId,
        required : true
    },
    status:{
        type:String,
        required : true,
        enum: {
            values:["ignore","accepted","rejected","interested"],
            message:`{VALUE} is incorrect status type`
        }
    },
},{
    timestamps:true
})

connectionRequestSchema.index({fromUserId:1,toUserId:1}); // indexing for structure of storing data for easy searching

connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    if(connectionRequest.toUserId.equals(connectionRequest.fromUserId)){
        throw new Error("You cannot send request to Yourself")
    }
    next();
});

const ConnectionRequest = mongoose.model("connectionRequest",connectionRequestSchema);
module.exports = ConnectionRequest;