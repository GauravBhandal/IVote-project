const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.port || 8080;
const mongoose = require("mongoose");
const { MONGOURI } = require("./config/keys");
const userRouter = require("./routes/userRouter");
const votersRouter = require("./routes/votersList");

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connect to mongo");
});
mongoose.connection.on("error", (err) => {
  console.log(" Does not Connect to mongo", err);
});

// app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);

app.use("/voters", votersRouter);

// if (process.env.NODE_ENV == "production") {
//   app.use(Express.static("client/build"));
//   const path = require("path");
//   app.get("*", (req, rse) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

app.listen(PORT, () => {
  console.log(`Server is started at ${PORT}`);
});
