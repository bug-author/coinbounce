const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.o8h4t.mongodb.net/?retryWrites=true&w=majority`,
  () => {
    console.log("Connected to MongoDB");
  }
);
