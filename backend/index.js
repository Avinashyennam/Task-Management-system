const mongoose = require('mongoose');
const express = require('express');
const app = express();
require('dotenv').config();
const cors = require("cors");
const mongouri = process.env.MONGO_URI;
const port = process.env.PORT;
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");

mongoose.connect(mongouri)
.then(()=>{
  console.log("MongoDB connected successfully")
})
.catch((err)=>{
  console.log("MongoDB connection failed", err)
}) 

app.use(cors({
  origin: 'http://localhost:3000', // Next.js default port
  credentials: true, // if you're using cookies or sessions
}));
app.use(express.json());

app.get("/", (req, res)=>{
  res.send("hello");
})
app.use('/api/auth', userRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(port, ()=>{
  console.log(`Server is running on port ${port}`);
})