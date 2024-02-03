// models/ResultModel.js
const mongoose = require('mongoose');

const jssOneResultSchema = new mongoose.Schema({
  results: [] // Array of arrays of mixed types
});

const JssOneResultModel = mongoose.model('jssOneResult', jssOneResultSchema);

module.exports = JssOneResultModel;
