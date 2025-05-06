const mongoose = require('mongoose');
const express = require('express');
const app = express();
require('dotenv').config();
const mongouri = process.env.MONGO_URI;
// console.log(mongouri);
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

app.use(express.json());
app.get("/", (req, res)=>{
  res.send("hello");
})
app.use('/api/auth', userRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(port, ()=>{
  console.log(`Server is running on port ${port}`);
})