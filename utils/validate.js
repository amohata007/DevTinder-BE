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

const validateProfile = (req) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "age",
    "skills",
    "bio",
    "gender",
  ];
  const isEditAllowed = Object.keys(req.body).every((item) =>
    allowedFields.includes(item)
  );
  return isEditAllowed;
};

module.exports = { validateFunction, validateProfile };
