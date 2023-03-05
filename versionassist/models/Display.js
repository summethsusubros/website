const mongoose = require('mongoose');


const displaySchema = new mongoose.Schema({
  code: {
    type: Number,
  },
  product: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
});


const Display = mongoose.model('display', displaySchema);
module.exports = Display;