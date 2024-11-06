const mongoose = require("mongoose");
require("dotenv").config();

let isDev = true;

mongoose
  // .connect(`${isDev ? process.env.LOCAL_URI : process.env.MONGODB_URI}`, {
  .connect(`${process.env.MONGODB_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("dababase connected");
  })
  .catch((err) => {
    console.log("db connect error=====>", err);
  });
