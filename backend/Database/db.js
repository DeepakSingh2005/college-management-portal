require("dotenv").config();
const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB_URI;

const connectToMongo = async () => {
  try {
    // Connection pooling options for better performance
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Connection pool size
      minPoolSize: 2,  // Minimum connections to maintain
      serverSelectionTimeoutMS: 5000, // Timeout for server selection
      retryWrites: true,
      w: "majority",
    });
    console.log("✅ Connected to MongoDB Successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    // Retry connection after 5 seconds
    setTimeout(connectToMongo, 5000);
  }
};

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("📡 MongoDB connection established");
});

mongoose.connection.on("error", (err) => {
  console.error("⚠️ MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("🔌 MongoDB connection disconnected");
});

module.exports = connectToMongo;
