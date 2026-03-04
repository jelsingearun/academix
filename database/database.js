const mongoose = require("mongoose");

const connectDB = async () => {
  try {
  await mongoose.connect("mongodb+srv://jelsingearun2004_db_user:jsRvzxAyPlTdyrJR@academix.gig7osp.mongodb.net/?appName=Academix");
    console.log("✅ MongoDB Connected Successfully (Localhost)");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
