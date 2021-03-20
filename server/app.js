const express = require('express');
const {
  routes: accountStatementRoutes
} = require("./routes/accountstatements")
const connectDB = require("./database/connection");
 
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use("/accountstatements", accountStatementRoutes);

connectDB();

const port = 8070;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});