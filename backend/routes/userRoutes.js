const router = require("express").Router();
const User = require("../models/User");

// user creation
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = new User.create({ email, password });
    await user.generateAuthToken();
    res.status(200).send();
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

module.exports = router;
