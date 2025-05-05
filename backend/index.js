const mongoose = require('mongoose');
const express = require('express');
const app = express();
const mongouri = process.env.MONGO_URI;
const port = process.env.PORT || 5000;
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
app.use('/api/auth', userRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(port, ()=>{
  console.log(`Server is running on port ${port}`);
})