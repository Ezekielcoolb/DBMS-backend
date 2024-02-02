const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  surname: String,
  firstname: String,
  classInterested: String,
  email: String,
  guidianceName: String,
  birth: String,
  guidiancePhone: String,
  address: String,
  reason: String,
  origin: String,
  lga: String,
  gender: String,
  previousClass: String,
  previousSchool: String,
  description: String
});

const AdmissionForm = mongoose.model('admissionform', admissionSchema);

module.exports = AdmissionForm;