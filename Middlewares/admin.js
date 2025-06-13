const AdminData = (req, res, next) => {
  console.log("Admin's Middleware");
  const token = "xyz";
  const isAUthAdmin = token === "xyz";
  if (isAUthAdmin) {
    next();
  } else {
    res.status(401).send("Unauthorized Token");
  }
};

module.exports = { AdminData };
