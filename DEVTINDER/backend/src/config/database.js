const mongoose = require('mongoose');

const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://udayporandla:4CyCBPQGl366LMOh@newcluster.urf21.mongodb.net/devtinder",{
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    
}

module.exports = connectDB;