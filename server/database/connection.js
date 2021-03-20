const mongoose = require("mongoose");
const configs = require("./../config/configs")

const connectDB = () => {
   mongoose.connect(configs.mongodb.dbURI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, () => {
      console.log("Database connection is successful");
   })
};

module.exports = connectDB;