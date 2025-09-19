const express = require('express');
const {UserModel} = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userRouter = express.Router();

userRouter.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  try {
    const existingUser = await UserModel.findOne({ username });
   
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const saltRounds = Number(process.env.SALT_ROUNDS) || 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new UserModel({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error('Signup error:', err); 
    res.status(500).json({ message: 'Server error' });
  }
});

userRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  try {
    const matchingUser = await UserModel.findOne({ username });
    if (!matchingUser) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, matchingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: matchingUser._id }, process.env.JWT_SECRET || "masai", {
      expiresIn: '1h' 
    });

    res.status(200).json({ msg: 'Login Successful!', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = {userRouter};