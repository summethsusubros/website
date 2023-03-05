const mongoose = require('mongoose');


const historySchema = new mongoose.Schema({
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
  action: {
    type: String,
    required: true,
  },
});


const History = mongoose.model('history', historySchema);
module.exports = History;