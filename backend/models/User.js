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
  articles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogPost",
    },
  ],
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

// instance method
UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "appSecret");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// static method
UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid login credentials");
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid login credentials");
  }
  return user;
};

// this will run whenever json response is sent back
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.articles;
  return userObject;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
