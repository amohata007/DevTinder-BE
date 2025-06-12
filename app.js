const express = require("express");

const app = express();

//Learning Dynamic Routes and Params
app.get("/user", (req, res) => {
  console.log(req.query);
  res.send("User Get Http Method");
});

app.get("/profile/:id/:name", (req, res) => {
  console.log(req.params);
  res.send("User Get Http Method");
});

// For particular http method - get,post,put,delete
app.get("/abc", (req, res) => {
  // ab?c , ab+c, ab*c, a(bc)?d, /a/
  res.send("Hello World!!");
});

app.post("/hello", (req, res) => {
  res.send({ name: "Abhishek" });
  console.log("Helloooooooo");
});

app.delete("/hello", (req, res) => {
  res.send({ name: "Abhishek" });
});

// app.use("/hello", (req, res) => {
//   res.send("Hello from the server..!!");
// });

// app.use("/test", (req, res) => {
//   res.send("Hello from the test server..!!");
// });

// app.use("/", (req, res) => {
//   res.send("Hello from the Dashboard..!!");
// });

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
