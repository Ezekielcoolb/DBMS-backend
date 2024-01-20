const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    default: 'divineblossom999@gmail.com', // Fixed email
  },
  password: {
    type: String,
    required: true,
    default: 'admin001', // Default password
  },
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
  try {
    // Only hash the password if it has been modified (or is new)
    if (this.isModified('password') || this.isNew) {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
