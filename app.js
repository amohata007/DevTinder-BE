const express = require("express");
const { connectDb } = require("./config/database.js");
const cookieParser = require("cookie-parser");
const app = express();
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");
const authRouter = require("./routes/auth.js");
const userRouter = require("./routes/user.js");

//Converting into proper json format
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
