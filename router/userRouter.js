const express = require("express");

const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");
/*
Name API : localhost:8000/user/register
Fields   : NAME, EMAIL, PASSWORD 
METHOD: post
*/
router.post("/register", async (req, res) => {
    console.log("Test Case 123");
    
  try {
    let { name, email, password } = req.body;

    // user existing or not
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(401).json({ error: "User Already Existed" });
    }
    //encode the password
    let salt = await bcrypt.genSaltSync(10);
    password = await bcrypt.hash(password, salt);

    //console.log(password);
    user = new User({ name, email, password });
    user = await user.save();
    res.status(200).json({ result: "success", user: user });
  } catch (err) {
    if (err) throw err;
    res.status(500).json({ error: "Server Error" });
  }
});
/*
Name API : localhost:8000/user/login
Fields   : EMAIL, PASSWORD 
METHOD: post
*/
router.post("/login", async (req, res) => {
  //Get the user from data
  let { email, password } = req.body;
  //verify the Register User or Not. (verify with Email)
  let user = await User.findOne({ email: email });
  if (!user) {
    return res.status(401).json({ error: "User Not Registered" });
  }
  //verify the passwrod
  let result = await bcrypt.compare(password, user.password);
  if (!result) {
    return res.status(401).json({
      status: "Password Not Match!",
    });
  }
  let payload = {
    user: {
      id: user.id,
    },
  };
  jwt.sign(payload, process.env.S_KEY, (err, token) => {
    if (err) throw err;
    res.status(200).json({
      status: "Login Successfull",
      token: token,
    });
  });
});
/*
Name API : localhost:8000/user/
   Fields:  No Fields
   METHOD: GET
   Access Type: Private
*/
router.get("/", authenticate, async (req, res) => {
  try {
    console.log(req.user.id);
    let user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: "Server Error" });
  }
});
module.exports = router;