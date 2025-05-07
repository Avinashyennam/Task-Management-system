const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("../routes/users");
const taskRoutes = require("../routes/tasks");

const mongouri = process.env.MONGO_URI;

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(mongouri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true;
  console.log("MongoDB connected");
}

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/tasks", taskRoutes);
app.get("/", (req, res) => res.send("API is working"));

module.exports = async (req, res) => {
  await connectDB();
  app(req, res); // Express handles the request
};
