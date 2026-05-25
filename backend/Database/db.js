const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({
  path: path.resolve(__dirname, "..", ".env"),
});

const DEFAULT_MONGODB_URI =
  "mongodb://127.0.0.1:27017/College-Management-System";

const getMongoUri = () => {
  const configuredUri = process.env.MONGODB_URI?.trim();

  if (configuredUri) {
    return configuredUri;
  }

  console.warn(
    "MONGODB_URI is not set. Falling back to local MongoDB at mongodb://127.0.0.1:27017/College-Management-System"
  );

  return DEFAULT_MONGODB_URI;
};

const connectToMongo = async () => {
  try {
    await mongoose.connect(getMongoUri(), {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      w: "majority",
    });
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    setTimeout(connectToMongo, 5000);
  }
};

mongoose.connection.on("connected", () => {
  console.log("MongoDB connection established");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB connection disconnected");
});

module.exports = connectToMongo;
