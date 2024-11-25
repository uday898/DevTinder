const jwt = require("jsonwebtoken");
const User = require('../models/User');

const userAuth = async (req,res,next)=>{
    try{
        const {token} = req?.cookies;
        if(!token){
          throw new Error("Pls Login, no token found");
        }
        const decodedMessage = await jwt.verify(token,"DevTinder");
        const {_id} = decodedMessage;
        const user = await User.findById(_id);
        if(!user){
          throw new Error("User not Find");
        }
        req.user = user;
        next();
    }catch(err){
        res.status(400).send('Error :' + err.message);
    }
};

module.exports = {userAuth};