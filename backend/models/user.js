const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// NOTE: Adds extra hook that checks data before it is saved to database
userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema);