const express = require("express");
const app = express();
const mongoose = require("mongoose");

require("dotenv").config();
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("MONGO CONNECTION ERROR!!!!");
    console.log(err);
  });

app.use("/api/user", require("./controllers/user.controller"));
app.use("/api/house", require("./controllers/house.controller"));
app.use("/api/room", require("./controllers/room.controller"));
app.use("/api/flower", require("./controllers/flower.controller"));
app.use("/api/device", require("./controllers/device.controller"));
app.use("/api/measurement", require("./controllers/measurement.controller"));

app.listen(process.env.PORT, () =>
  console.log(`App runs on port: ${process.env.PORT}`),
);
