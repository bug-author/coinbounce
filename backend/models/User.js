const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  email: {
    type: "string",
    lowercase: true,
    unique: true,
    required: [true, "Can't be blank"],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Is invalid"],
    index: true,
  },

  password: {
    type: "string",
    required: [true, "Can't be blank"],
  },

  tokens: [],
  articles: [],
});

UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.generateAuthToken = async () => {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "appSecret");
  user.tokens.concat({ token });
  await user.save();
  return;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
