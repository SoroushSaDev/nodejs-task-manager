const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    firstname: {type: String},
    lastname: {type: String},
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
      },
    refreshToken: { type: String },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
      return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
  })
  
  userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
  }

module.exports = mongoose.model('User', userSchema);
