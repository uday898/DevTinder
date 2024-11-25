const express = require("express");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/User");
const requestRouter = express.Router();
const { userAuth } = require("../middleWare/auth");

requestRouter.post("/request/send/:status/:toUserId",userAuth, async (req,res,next) =>{
    try{
        const fromUserId = req.user?._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({ message:"Invalid Status type: "+ status})
            // throw new Error("Invalid Status type: "+ status)
        }

        const user = await User.findById(toUserId);
        if(!user){
            return res.status(400).json({ message:"User not Found"});
        }

        const existingRequest = await ConnectionRequest.findOne({
            $or:[
                { fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })

        if(existingRequest){
            throw new Error("Request already exist");
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,toUserId,status
        })

        const data = await connectionRequest.save();
        res.json({
            message: "Request Sent successfully",
            data
        });

    }catch(err){
        res.status(400).send("Error: "+ err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId",userAuth, async(req,res,next)=>{
    //check for valid reqeustId
    //only touserId can change the status
    //lognedin user should be touserid
    //only interested status can be changed
    //only status can be only accepted or rejected
    try{
        const loggedInuser = req.user;
        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(req.params.status)){
            return res.status(400).json({ message:"Invalid Status type: "+ req.params.status})
            // throw new Error("Invalid Status type: "+ status)
        }
        const conRequest = await ConnectionRequest.findOne({
            _id: req.params.requestId,
            toUserId: loggedInuser._id, // loggedinuser
            status:"interested" 
        });

        if(!conRequest){
            return res.status(400).json({ message:"Invalid connection Req"})
        }

        conRequest.status = req.params.status;
        await conRequest.save();

        res.send(`${req.params.status} Successfully`);
    }catch(err){
        res.status(400).send("Error: "+ err.message);
    }

});

module.exports = requestRouter;