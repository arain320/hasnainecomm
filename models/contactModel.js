const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please add a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "please add a email"],
    trim: true,
  },
  message: {
    type: String,
    required: [true, "please add a name"],
    trim: true,
    unique: true,
    minLength: [6, "message must be 6 characters long"],
    maxLength: [200, "message must be under 200 characters"],
  },
});

const Contact = new mongoose.model("Contact", contactSchema);
module.exports = Contact;
