const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  admin: {
    type: Number,
    required: true,
  },
  varify: {
    type: Number,
    default: 0,
  },
  token:{
    type:String,
    default:" "
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
