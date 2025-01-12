const mongoose = require("mongoose");
let isConnected = false;

export const connectDB = async () => {
  try {
    if (isConnected) return console.log("already connected!");
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log("Database connected successfully!");
  } catch (err) {
    console.log(err);
    throw new Error("Fail to connect DB!");
  }
};
