const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  jssGeneral: {
    type: String,
    required: true,
  },
  jssThree: {
    type: String,
    required: true,
  },
  sssGeneral: {
    type: String,
    required: true,
  },
  sssThree: {
    type: String,
    required: true,
  },
});

const Schoolfee = mongoose.model('schoolfee', dataSchema);

module.exports = Schoolfee;
