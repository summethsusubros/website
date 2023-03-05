const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: [String],
  },
  requested: {
    type: [String],
  },
  owned: {
    type: [String],
  },
  message: {
    type: [String],
  }
});


const User = mongoose.model('user', userSchema);
module.exports = User;