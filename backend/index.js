const mongoose = require('mongoose');
const express = require('express');
const app = express();
const mongouri = process.env.MONGO_URI;
const port = process.env.PORT || 5000;
mongoose.connect(mongouri)
.then(()=>{
  console.log("MongoDB connected successfully")
})
.catch((err)=>{
  console.log("MongoDB connection failed", err)
}) 

app.use()

app.get("/getuser", (req, res)=>{
  res.json({});
})

app.listen(port, ()=>{
  console.log(`Server is running on port ${port}`);
})