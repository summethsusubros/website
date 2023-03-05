const mongoose = require('mongoose');


const platformSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  }
  });

const Platform = mongoose.model('platform', platformSchema);
module.exports = Platform;