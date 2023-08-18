const express = require("express");
const router = new express.Router();
const User = require("../models/userModel");
const Contact = require("../models/contactModel");
const protect = require("../middleWare/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//register the user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, cpassword } = req.body;
    if (!name || !email || !password || !cpassword) {
      res
        .status(400)
        .json({ status: 400, message: "please fill all the fields" });
      throw new Error("please fill all the fields");
    }
    if (password.length < 6) {
      res
        .status(400)
        .json({ status: 400, message: "password must be 6 characters long" });
      throw new Error("password must 6 characters long");
    }
    // Check if user email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res
        .status(400)
        .json({ status: 400, message: "Email has been already registered" });
      throw new Error("Email has already been registered");
    }
    const userData = new User({
      name: name,
      email: email,
      password: password,
    });
    const finalUser = await userData.save();
    if (finalUser) {
      res.status(201).json({ status: 201, message: "registration successful" });
    } else {
      res.status(400).json({ status: 400, message: "invalid user data" });
      throw new Error("invalid user data");
    }
  } catch (err) {
    res
      .status(401)
      .json({ status: 401, err, message: "register error in happen" });
  }
});

//login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res
        .status(400)
        .json({ status: 400, message: "please fill all the fields" });
      throw new Error("please add email and password");
    }
    const findUser = await User.findOne({ email });
    if (!findUser) {
      res
        .status(400)
        .json({ status: 400, message: "invalid email or password" });
      throw new Error("invalid email or password");
    }
    const checkPassword = await bcrypt.compare(password, findUser.password);
    if (!checkPassword) {
      res
        .status(400)
        .json({ status: 400, message: "invalid password or email" });
      throw new Error("invalid password or email");
    }
    if (findUser && checkPassword) {
      const token = jwt.sign({ id: findUser._id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400),
        sameSite: "none",
        secure: true,
      });
      res.status(200).json({
        status: 200,
        message: "login verification successful",
        token: token,
      });
    } else {
      res
        .status(400)
        .json({ status: 400, message: "invalid email or password or both" });
      throw new Error("invalid password or email or both");
    }
  } catch (error) {
    res
      .status(401)
      .json({ status: 401, error, message: "register error in happen" });
  }
});

// get login status
router.get("/status", protect, async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId, "-password");
    if (!user) {
      res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(404).json({ status: 404, message: "user not found" });
    throw new Error("not authorized catch, please login");
  }
});

//logout user
router.get("/logout", protect, async (req, res) => {
  try {
    res.cookie("token", "", {
      path: "/",
      httpOnly: true,
      expires: new Date(0),
      sameSite: "none",
      secure: true,
    });
    return res.status(200).json({
      message: "successfully logout",
    });
  } catch (error) {
    res.json({ error });
  }
});

//get message of user and save it in database
router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ status: 400, message: "please fill all field" });
      throw new Error("please fill all the fields");
    }
    const checkEmail = await User.findOne({ email });
    if (!checkEmail) {
      res.status(400).json({ status: 400, message: "please login first" });
      throw new Error("please login first");
    }
    const checkMessage = await Contact.findOne({ message });
    if (checkMessage) {
      res
        .status(400)
        .json({ status: 400, message: "this message is already sent" });
      throw new Error("message already sent");
    }
    if (checkEmail || !checkMessage) {
      const messageData = new Contact({
        name: name,
        email: email,
        message: message,
      });
      const saveMessage = await messageData.save();
      if (saveMessage) {
        res
          .status(200)
          .json({ status: 200, message: "message sent successfully" });
      }
    } else {
      res.status(400).json({ status: 400, message: "somthing went wrong" });
    }
  } catch (err) {
    res
      .status(401)
      .json({ status: 401, err, message: "register error in happen" });
  }
});

module.exports = router;
