const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  version:  { type : Array , "default" : [] }
  
});


const Product = mongoose.model('product', productSchema);
module.exports = Product;