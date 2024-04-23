const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/instagram");
    // await mongoose.connect(process.env.DATABASE_URI);
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
