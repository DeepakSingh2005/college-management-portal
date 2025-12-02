const connectToMongo = require("./Database/db");
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

// Initialize database connection
connectToMongo();

// Port configuration - proper precedence
const port = process.env.PORT || 4000;

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_API_LINK || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "50mb" })); // Increased limit for file uploads
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Static media files
app.use("/media", express.static(path.join(__dirname, "media")));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Hello 👋 I am Working Fine 🚀",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// API Routes - grouped by feature
app.use("/api/admin", require("./routes/details/admin-details.route"));
app.use("/api/faculty", require("./routes/details/faculty-details.route"));
app.use("/api/student", require("./routes/details/student-details.route"));

app.use("/api/branch", require("./routes/branch.route"));
app.use("/api/subject", require("./routes/subject.route"));
app.use("/api/notice", require("./routes/notice.route"));
app.use("/api/timetable", require("./routes/timetable.route"));
app.use("/api/material", require("./routes/material.route"));
app.use("/api/exam", require("./routes/exam.route"));
app.use("/api/marks", require("./routes/marks.route"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { error: err.stack }),
  });
});

// Start server
const server = app.listen(port, () => {
  console.log(`
╔════════════════════════════════════╗
║  🚀 Server Started Successfully!   ║
║  📍 http://localhost:${port}         ║
╚════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
