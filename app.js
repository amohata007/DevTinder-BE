const express = require("express");
const { connectDb } = require("./config/database.js");
const User = require("./models/user.js");

const app = express();

app.post("/signup", async (req, res) => {
  //creating a new instance of User model
  const user = new User({
    firstName: "MS",
    lastName: "Dhoni",
    age: 43,
    gender: "Male",
  });

  try {
    await user.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Error while saving user: ", err.message);
  }
});

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
