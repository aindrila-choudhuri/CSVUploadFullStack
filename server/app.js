const express = require('express');
const cors = require('cors')
const {
  routes: accountStatementRoutes
} = require("./routes/accountstatements")
const {connectDB} = require("./database/connection");
 
const app = express();
app.use(cors())

app.use(express.urlencoded({ extended: true }));
app.use("/accountstatements", accountStatementRoutes);

const port = 8070;
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Running at localhost:${port}`);
  });
})
module.exports = app;