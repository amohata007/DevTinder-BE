const express = require("express");
const { connectDb } = require("./config/database.js");
const User = require("./models/user.js");

const app = express();

//Converting into proper json format
app.use(express.json());

app.post("/signup", async (req, res) => {
  //creating a new instance of User model
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Error while saving user: " + err.message);
  }
});
//get data by age
app.get("/age", async (req, res) => {
  try {
    const userAge = req.body.age;
    const getByAge = await User.find({ age: userAge });
    if (getByAge.length === 0) {
      res.status(404).send("No user with age: " + userAge);
    } else {
      res.send(getByAge);
    }
  } catch (err) {
    res.status(400).send("Error while reading user: " + err.message);
  }
});

//get all user data
app.get("/feed", async (req, res) => {
  try {
    const getAllData = await User.find({});
    res.send(getAllData);
  } catch (err) {
    res.status(400).send("Error while reading user: " + err.message);
  }
});

//delete data by id
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  // console.log(userId);
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully..!!");
  } catch (err) {
    res.status(400).send("Error while deleting user: " + err.message);
  }
});

//Update data by id
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, data);
    res.send("Updated Successfully..!!");
  } catch (err) {
    res.status(400).send("Error while updating user: " + err.message);
  }
});

//update by age
app.patch("/userr", async (req, res) => {
  const findAge = req.body.age;
  const data = req.body;
  try {
    const user = await User.updateMany({ age: findAge }, { $set: data });
    res.send("Updated Successfully..!!");
  } catch (err) {
    res.status(400).send("Error while updating user: " + err.message);
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
