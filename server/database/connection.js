const mongoose = require("mongoose");
const configs = require("./../config/configs")

const connectDB = async () => {
   return new Promise((resolve, reject) => {
      mongoose.connect(configs.mongodb.dbURI2, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
         .then((res, err) => {
            if(err) return reject(err);
            console.log("Connected to DB");
            resolve();
      });
   })
};

const closeDB = () => {
   return mongoose.disconnect()
}

module.exports = {connectDB, closeDB};