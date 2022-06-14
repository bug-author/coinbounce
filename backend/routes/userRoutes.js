const router = require("express").Router();
const User = require("../models/User");
const authUser = require("../middleware/auth");

// user creation Sign Up
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    // bugfix await instead of new
    const user = await User.create({ email, password });
    const token = await user.generateAuthToken();
    res.status(201).json({ user, token });
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
    const token = await user.generateAuthToken();
    res.json({ user, token });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// logout

// in between of routing to /logout and sending response we want to check if the user is authenticated by using the
// middleware

router.delete("/logout", authUser, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((tokenObj) => {
      return tokenObj.token !== req.token;
    });
    await req.user.save();
    res.status(200).send();
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
