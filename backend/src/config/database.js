const mongoose = require("mongoose");

const mongoDb = async() => {
    const URI = "mongodb+srv://learnbydoing00:yMkkenXED0NfJiMh@nodelearning.sel3b9f.mongodb.net/devTinderPractice";
    
    await mongoose.connect(URI);
    console.log("db connection done");
}

module.exports = mongoDb;