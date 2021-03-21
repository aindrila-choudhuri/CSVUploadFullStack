const mongoose = require("mongoose");
const configs = require("./../config/configs")

const connectDB = async () => {
   try {
      await mongoose.connect(configs.mongodb.dbURI2, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, () => {
         console.log("Database connection is successful");
      });
   } catch (err) {
      console.log('error: ' + err)
   }
};

module.exports = connectDB;