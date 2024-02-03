// models/ResultModel.js
const mongoose = require('mongoose');

const jssOneResultSchema = new mongoose.Schema({
    term: String,
    selectedClass: String,
  results: [[mongoose.Schema.Types.Mixed]] // Array of arrays of mixed types
});

const JssOneResultModel = mongoose.model('jssOneResult', jssOneResultSchema);

module.exports = JssOneResultModel;
