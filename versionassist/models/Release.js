const mongoose = require('mongoose');


const releaseSchema = new mongoose.Schema({
  toolsVersion: {
    type: String,
    required: true,
  },
  build: {
    type: [String],
  }, 
  releaseCode: {
    type: Number,
  }
  });


const Release = mongoose.model('release', releaseSchema);
module.exports = Release;