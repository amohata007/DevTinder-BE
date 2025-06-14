const express = require("express");
const { connectDb } = require("./config/database.js");

const app = express();

connectDb()
  .then(() => {
    console.log("Database connected succesfully..");
    app.listen(3000, () => {
      console.log("Listening on port 3000");
    });
  })
  .catch(() => {
    console.log("Database Not Connected");
  });
