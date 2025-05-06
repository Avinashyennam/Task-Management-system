const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const User = require("../models/user");

const signup = async (req, res) => {
  try {
      const { email, password, name, role } = req.body;
      let user = await User.findOne({ email });
      if (user) {
          return res.status(400).json({ msg: 'User already exists' });
      }
      user = new User({
          name,
          email,
          password,
          role
      });

      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      let savedUser = await user.save();

      const token = jwt.sign( { id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
      return res.status(201).json({
          message: "signup successful",
          token: token,
          user: {
              id: savedUser._id,
              email: savedUser.email,
              name: savedUser.name,
              role: savedUser.role
          },
      });
  } catch (error) {
      console.log("error at signup", error);
      res.status(500).json({ message: "internal server error at signup" });
  }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "all fields are required" });
        }

        // check if user exist or not
        let user = await User.findOne({ email });
        if (user === null) {
            return res.status(404).json({ message: "user not found, please signup" });
        }

        // check whether the passwords same or not
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
            expiresIn: "1h"
        });

        res.status(200).json({ message: "login successful", user, token });
    } catch (error) {
        console.log("error at login", error);
        res.status(500).json({ message: "internal server error at login" });
    }
}

module.exports = {signup, login}