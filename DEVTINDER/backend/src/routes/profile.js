const express = require("express");
const profileRouter = express.Router();
const User = require("../models/User");
const { userAuth } = require("../middleWare/auth");
const {validateProfileEdit} = require("../utils/validations");
const bcrypt = require('bcrypt');

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user; // user is taken from the userAuth
    res.send(user);
  } catch (err) {
    res.status(400).send("Error " + err);
  }
});

profileRouter.patch("/profile/edit",userAuth, async (req, res) => {
  try {
    
    if(!validateProfileEdit(req)){
        throw new Error("Invalid Edit")
    }
    const loggedInUser = req.user; // from userAuth

    Object.keys(req.body).forEach((key)=> loggedInUser[key] = req.body[key]);
    await loggedInUser.save();
   /*  res.json({
        "messsage": `${loggedInUser.firstName} your Profile is updated`,
        "data": loggedInUser
    }) */
    /* const user = await User.findOneAndUpdate({ email: userEmail }, data, {
      returnDocument: "before", // after
      runValidators: true,
    }); */
    /*  const user = await User.findOneAndUpdate({_id:userId},data , {
        returnDocument: "before"
      }); */
    // will send array with the filter
    //await User.findByIdAndUpdate(userId,data); // both are equivalent but this is using Id
    console.log(loggedInUser);
    res.send("User updated sucessfully");
  } catch(err) {
    res.status(400).send("Error :" + err);
  }
});

profileRouter.patch("/profile/editPassword",userAuth, async (req, res) => {
    try {
      const loggedInUser = req.user; // from userAuth
      const {password} = req.body; 
      const passwordHash = await bcrypt.hash(password,10);
      const user = await User.findByIdAndUpdate(loggedInUser._id, {password:passwordHash}, {
        returnDocument: "before", // after
        runValidators: true,
      });
      console.log(user);
      res.send("User updated sucessfully");
    } catch(err) {
      res.status(400).send("Error :" + err);
    }
  });

profileRouter.get("/getuser", async (req, res) => {
  const userEmailId = req.body.email;
  console.log(userEmailId);
  try {
    //const users = await User.find({}); // All users
    const users = await User.find({ email: userEmailId }); // will send array with the filter
    //const user = await User.findOne({email:userEmailId}); // will send only one doc
    if (users.length === 0) {
      res.send("User Not Found");
    } else {
      res.send(users);
    }
  } catch {
    res.status(400).send("Error in Searching User");
  }
});

module.exports = profileRouter;
