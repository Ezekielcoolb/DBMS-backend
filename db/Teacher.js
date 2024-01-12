const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: String,
  number: String,
  gender: String,
  email: String,
  address: String,
  qualification: String,
  teacherId: String,
  classAssigned: String,
  departmentAssinged: String,
  subjectsAssigned: [String], // Array of subjects
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
