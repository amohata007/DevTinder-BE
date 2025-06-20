const express = require("express");
const { connectDb } = require("./config/database.js");
const User = require("./models/user.js");
const validateFunction = require("./utils/validate.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./Middlewares/admin.js");

const app = express();

//Converting into proper json format
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    //Validate data at first instance
    validateFunction(req);

    //Hashing of the password
    const { firstName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(409).send("Email already registered");
    }

    //creating a new instance of User model
    const user = new User({
      firstName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Error while saving user: " + err.message);
  }
});

//login api
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (user) {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (isValidPassword) {
        //expires Token
        //can also expires Cookie - expires keyword
        const token = await jwt.sign({ _id: user._id }, "Namaste@123", {
          expiresIn: "7d",
        });
        res.cookie("token", token);
        res.send("Login Successfull");
      } else {
        throw new Error("Invalid Credentials");
      }
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Problem while Login in: " + err.message);
  }
});

//Profile Get
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log(user, "user");
    res.send(user);
  } catch (err) {
    res.status(400).send("Error while reading user: " + err.message);
  }
});

// Send Connection
app.post("/sendConnection", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("Sent Connection Successfully!!");
    res.send("Connection Sent by " + user.firstName);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
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
    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
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
    const user = await User.updateMany(
      { age: findAge },
      { $set: data },
      {
        runValidators: true,
      }
    );
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
