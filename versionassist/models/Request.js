const mongoose = require('mongoose');


const requestSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
  },
  email: { 
        type: String,
        required: true,
        lowercase: true,
  },
  name: { 
    type: String,
    required: true,
  }
  });


const Request = mongoose.model('request', requestSchema);
module.exports = Request;