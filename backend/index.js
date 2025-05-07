const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");

const app = express();

let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true;
  console.log("MongoDB connected");
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/tasks", taskRoutes);
app.get("/", (req, res) => res.send("API is working"));

// Export serverless handler
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);  // let Express handle it
};
