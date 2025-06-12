const express = require("express");

const app = express();

//Multiple route handlers
app.get(
  "/user",
  (req, res, next) => {
    //This is Middleware //can have multiple middleware
    console.log("Route1");
    // res.send("Hello from route 1");
    next();
  },
  (req, res) => {
    //This is route handler
    console.log("Route2");
    res.send("Hello from route 2");
  }
);

//Learning Dynamic Routes and Params
// app.get("/user", (req, res) => {
//   console.log(req.query);
//   res.send("User Get Http Method");
// });

// app.get("/profile/:id/:name", (req, res) => {
//   console.log(req.params);
//   res.send("User Get Http Method");
// });

// // For particular http method - get,post,put,delete
// app.get("/abc", (req, res) => {
//   // ab?c , ab+c, ab*c, a(bc)?d, /a/
//   res.send("Hello World!!");
// });

// app.post("/hello", (req, res) => {
//   res.send({ name: "Abhishek" });
//   console.log("Helloooooooo");
// });

// app.delete("/hello", (req, res) => {
//   res.send({ name: "Abhishek" });
// });

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
