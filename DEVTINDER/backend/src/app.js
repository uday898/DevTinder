const express = require("express");
const connectDB = require('./config/database');
const User = require('./models/User');
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user")

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

app.delete('/deleteuser', async (req,res)=>{
  const userId = req.body.userId;
   try{
     await User.findByIdAndDelete({_id:userId}); // will send array with the filter
     //const user = await User.findByIdAndDelete(userId); // shorthand for above
    res.send('User Deleted sucessfully');
   }catch{
     res.status(400).send('Error in deleting User');
   }
 })

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.log(err)
    console.error("Database cannot be connected!!");
  });