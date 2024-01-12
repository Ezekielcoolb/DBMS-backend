
const mongoose = require('mongoose');
const dbURI = 'mongodb+srv://ezekielcoolb:dbms@cluster0.1bb6prs.mongodb.net/'; // Change this to your MongoDB URI

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});