const nodemailer = require("nodemailer");
const fs = require("fs");

const CONFIG_SOURCE = `${__dirname}/../../config.json`;
let config = null;

if (config === null) {
  const file = fs.readFileSync(CONFIG_SOURCE, "utf-8");
  config = JSON.parse(file);
}

const getSection = (section) => {
  if (!config[section]) throw `Configuration section ${section} does not exist`;

  if (section === "development" && !config[section].jwt_secret) {
    config[section].jwt_secret = process.env.JWT_SECRET;
  }

  return config[section];
};

module.exports = {
  getSection,
};
