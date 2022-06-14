const router = require("express").Router();
const User = require("../models/User");

// user creation Sign Up
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    // bugfix await instead of new
    const user = await User.create({ email, password });
    await user.generateAuthToken();
    res.status(201).json(user);
  } catch (error) {
    let msg;
    if (error.code === 11000) {
      msg = "Email already exists";
    } else {
      msg = error.message;
    }
    res.status(400).json(msg);
  }
});

// login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    await user.generateAuthToken();
    res.json(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
