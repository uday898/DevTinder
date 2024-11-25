const validator = require('validator');

validateSignUp = (req)=>{
    const {firstName,lastName,email,photoURL,password} = req?.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }else if(!validator.isEmail(email)){
        throw new Error("Email is not valid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong");
    }/* else if(!validator.isURL(photoURL)){
        throw new Error("Photo URL is not valid");
    } */
}

validateProfileEdit = (req) =>{
    const allowedEditFields = ["firstName","lastName","photoURL","skills", "email", "gender","age"];
    const isupdateAllowed = Object.keys(req.body).every((k) => allowedEditFields.includes(k));
    return isupdateAllowed;
}

module.exports = {
    validateSignUp,validateProfileEdit
}