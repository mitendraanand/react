const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

////////// FAT MODEL and THIN CONTROLLER /////////////
// PUT AS MUCH AS BUSINESS LOGIC AS POSSBILE IN MODEL
// AND KEEP THE CONTROLLER AS THIN AS POSSIBLE WITH
// ONLY APPLICATION LOGIC
//////////////////////////////////////////////////////

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A user must have a name']
    },
    email: {
      type: String,
      required: [true, 'A user must have an email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide valid email']
    },
    photo: {
      type: String
    },
    password: {
      type: String,
      required: [true, 'A user must have a password'],
      minlength: 8
    },
    passwordConfirm: {
      type: String,
      required: [true, 'A user must have a confirm password'],
      validate: {
        // This only works on SAVE!!!
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!'
      }
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// MIDDLEWARE for Password ENCRYPTION/HASHING if password was modified.
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  // HASH the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the password confirm
  this.passwordConfirm = undefined;

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;