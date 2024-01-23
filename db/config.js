
require('dotenv').config();

const mongoose = require('mongoose');



const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
console.log(dbPass);

const dbURI = `mongodb+srv://${dbUser}:${dbPass}@cluster0.oo9xu8g.mongodb.net/`; // Change this to your MongoDB URI

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});