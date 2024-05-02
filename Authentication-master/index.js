const mongoose = require("mongoose");
const URI = `mongodb+srv://gohilbhaidww:JUetKEbcl0B5iWks@cluster0.fzewx9q.mongodb.net/`;
mongoose
  .connect(URI)
  .then(() => {
    console.log("Dtabase Connection Successfully...");
  })
  .catch((err) => {
    console.log("Database Connection Failed!!!", err);
  });

//server create📟💻
const express = require("express");
// const cors = require("cors");

const route = require("./routes/userRoute.js");
const PORT = process.env.SERVER_PORT || 5000;

const app = express();

app.use("/", route);
app.use(express.json());
// app.use(cors());

app.listen(PORT, () => {
  console.log(`Server Start At Port ${PORT}`);
});
