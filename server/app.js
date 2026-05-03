const express = require("express");
const app = express();
const mongoose = require("mongoose");

require("dotenv").config();
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/flowerApp")
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("MONGO CONNECTION ERROR!!!!");
    console.log(err);
  });

app.use("/home", require("./controllers/home.controller"));
app.use("/room", require("./controllers/room.controller"));
app.use("/flower", require("./controllers/flower.controller"));
app.use("/device", require("./controllers/device.controller"));
app.use("/measurement", require("./controllers/measurement.controller"));

app.listen(process.env.PORT, () =>
  console.log(`App runs on port: ${process.env.PORT}`),
);
