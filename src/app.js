const express = require("express");

const app = express();

app.use("/hello", (req, res) => {
  res.send("Hello from the server..!!");
});

app.use("/test", (req, res) => {
  res.send("Hello from the test server..!!");
});

app.use("/", (req, res) => {
  res.send("Hello from the Dashboard..!!");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
