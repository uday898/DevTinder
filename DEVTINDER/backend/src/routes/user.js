const express = require("express");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/User");
const userRouter = express.Router();
const { userAuth } = require("../middleWare/auth");
const USER_SAFE_DATA = "firstName photoURL skills";

userRouter.get("/user/requests",userAuth, async(req,res,next)=>{
    try{
        const loggedInuser = req.user;
        const requestsList = await ConnectionRequest.find({
            toUserId:loggedInuser._id,
            status: "interested"
        }).populate("fromUserId",["firstName","photoURL","skills"]);
        res.json({
            message: "Data Fetched Successfully",
            data: requestsList
        });
    }catch(err){
        res.status(400).send("Error: "+ err.message);
    }
});

userRouter.get("/user/connections",userAuth, async(req,res,next)=>{
    try{
        const loggedInuser = req.user;

        const connectionsList = await ConnectionRequest.find({
        $or:[
            {toUserId:loggedInuser._id , status: "accepted"},
            {fromUserId:loggedInuser._id,status: "accepted"}
        ]})
        .populate("fromUserId",["firstName","photoURL","skills"])
        .populate("toUserId",USER_SAFE_DATA); // works either way above and this

        const data = connectionsList.map((record)=>{
            if(record.fromUserId.equals(loggedInuser._id)){ // where this user sent the request
                return record.toUserId;
            }
            return record.fromUserId;
        })

        res.json({
            message: "Data Fetched Successfully",
            data });

    }catch(err){
        res.status(400).send("Error: "+ err.message);
    }
});

userRouter.get("/user/feed",userAuth, async(req,res,next)=>{
    try{
        const loggedInuser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page-1)*limit;

        const connectionsList = await ConnectionRequest.find({
        $or:[
            {toUserId:loggedInuser._id },
            {fromUserId:loggedInuser._id}
        ]}).select("fromUserId toUserId");

        const hideFeedUserList = new Set();
        connectionsList.map((record)=>{
            hideFeedUserList.add(record.toUserId);
            hideFeedUserList.add(record.fromUserId);
        })

        const feedList = await User.find({
            $and:[
                {_id : {$nin: Array.from(hideFeedUserList)} },
                {_id : {$ne: loggedInuser._id}}
            ]
        }).select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);
        res.json({feedList });
    }catch(err){
        res.status(400).send("Error: "+ err.message);
    }
});

module.exports = userRouter;