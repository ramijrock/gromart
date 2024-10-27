const mongoose = require("mongoose");
require("dotenv").config();
let databaseName = "GroMart";
mongoose
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
