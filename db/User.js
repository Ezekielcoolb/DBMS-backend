const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  surname: String,
  firstname: String,
  class: String,
  department: String,
  admission: String,
  birth: Date,
  guidiance: String,
  address: String,
  status: String,
  origin: String,
  lga: String,
  gender: String,
  amount: String,
  category: String,
  subjectsOffer: [String]
});

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;