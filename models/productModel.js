const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  price: {
    type: String,
    required: [true, "please add a price"],
    trim: true,
  },
  path: {
    type: String,
    required: [true, "please add a path"],
  },
  category: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },

  tag: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
});

const Product = new mongoose.model("Product", productSchema);

module.exports = Product;
