const { Validator } = require("node-input-validator");

const UserLogin = {
  email: "required|email",
  password: "required|string",
};

const UserRegister = {
  name: "required|string",
  email: "required|email",
  password: "required|string",
  confirmPassword: "required|string",
};

const UserRegisterStartup = {
  name: "required|string",
  email: "required|email",
  password: "required|string|min:8",
  address: "required|string",
  phone: "string",
  role: "required|string|in:startup",
  representative: "required|string",
  profileImage: "url",
  jobsPosted: "array",
};

const UserRegisterMentor = {
  name: "required|string",
  email: "required|email",
  password: "required|string|min:8",
  phone: "required|string",
  role: "required|string|in:mentor",
  profession: "string",
  skills: "array",
  desc: "string",
  profileImage: "url",
  acceptedJobs: "array",
};

const UserReset = {
  email: "required|email",
  newPassword: "required|string",
  oldPassword: "required|string",
};

const validate = async (data, schema) => {
  let v = new Validator(data, schema);
  let e = v.check();
  if (!e) {
    throw {
      code: 400,
      error: v.errors,
    };
  }
};
module.exports = {
  UserLogin,
  UserRegister,
  UserRegisterStartup,
  UserRegisterMentor,
  UserReset,
  validate,
};
