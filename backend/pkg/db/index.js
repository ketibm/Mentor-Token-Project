const mongoose = require("mongoose");
const { getSection } = require("../config");
const { MONGO_USERNAME, MONGO_PASSWORD } = getSection("development");
const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.qzdzfnq.mongodb.net/Project?retryWrites=true&w=majority&appName=Cluster0`;

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected!");
  } catch (err) {
    console.error(err.message);
  }
}

connect();
