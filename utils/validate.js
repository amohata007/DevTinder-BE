const validator = require("validator");

const validateFunction = (req) => {
  const { firstName, emailId, password } = req.body;
  if (!firstName) {
    throw new Error("Name is required..!!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter valid email..!!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password..!!");
  }
};

module.exports = validateFunction;
