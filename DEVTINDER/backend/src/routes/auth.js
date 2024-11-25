const express = require("express");
const authRouter = express.Router();
const User = require('../models/User');
const {validateSignUp} = require('../utils/validations');
const bcrypt = require('bcrypt');

authRouter.post('/login',async (req,res)=>{
    try{  
      const {email,password} = req?.body;
      const user = await User.findOne({email});
      console.log(user);
      if(!user){
        throw new Error("Email Id doesn't exist");
      }
      const passwordMatch = await bcrypt.compare(password,user.password);
      if(passwordMatch){
  
        const token = await user.getJWt();
        res.cookie("token",token,{
          expires: new Date(Date.now() + 8 * 3600000)
        });
  
        res.send("Logged in Successfully");
      }else{
        throw new Error('Wrong Password');
      }
    }catch(err){
      res.status(400).send('Error :' + err.message);
    }
   });
  
authRouter.post('/signup', async (req,res)=>{
    const {firstName,lastName,email,password,gender,age,skills} = req.body;
  
    console.log(req.body);
    /*  const user = new User({
      firstName: 'Uday',
      lastName: 'Porandla',
      email: 'udaykumar@gamil.com',
      password: '2e2jrjhwqjrh'
      }); */
      
      try{
        validateSignUp(req);
        const passwordHash = await bcrypt.hash(password,10);
  
        const user = new User({
          firstName,lastName,email,password:passwordHash,gender,skills,age
        });
  
  
      await user.save();
      res.send('User created Sucessfully');
    }catch(err){
      res.status(400).send('Error :' + err.message);
    }
  });

authRouter.post('/logout', async(req,res,next)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now())
    })
    .send("Logout Successful");
});

  module.exports = authRouter;
  