const express = require("express");
const cors = require("cors");
require("./connection");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use("/users", userRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
