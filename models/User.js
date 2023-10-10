// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,

  },
  email: {
    type: String,

  },
  password: {
    type: String,
  },
  otp:{
    type: String
  }, 
  newPassword:{
    type: String
  }
});

module.exports = mongoose.model('User', userSchema);
