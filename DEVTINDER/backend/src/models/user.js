const mongoose = require('mongoose');
const validator = require('validator'); // we can you this in the api validation also
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength:4,
        maxLength:10
    },
    // firstName: String // shorthand
    lastName:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('password is not strong')
            }
        }
    },
    email:{
        type: String,
        required: true,
        lowercase:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('invalid email')
            }
        }
    },
    age:{
        type: Number,
        min:18,
        required:true
    },
    gender:{
        type:String,
        validate(value){
            if(!['Male','Female','others'].includes(value)){
                throw new Error('Gender not invalid')
            }
        },
        required:true
    },
    skills:{
        type:[String]
    },
    photoURL:{
        type:String,
        default:"https://geographyandyou.com/images/user-profile.png"
    }
},{
    timestamps:true
});

userSchema.methods.getJWt = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id},"DevTinder",{
        expiresIn:"7d" // "1h" , ""
      });
      return token;
}

const User = mongoose.model("User",userSchema);
module.exports = User;