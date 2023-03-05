const mongoose = require('mongoose');


const presentSchema = new mongoose.Schema({
  code: {
    type: Number,
  },
  product: {
    type: String,
    required: true,
  },
  toolsRelease: {
    type: String,
    required: true,
  },
  build: {
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


const Present = mongoose.model('present', presentSchema);
module.exports = Present;