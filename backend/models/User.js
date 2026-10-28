// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: { 
    type: [String], 
    default: ['USER'], 
    enum: ['USER', 'ADMIN', 'MANAGER'] 
  }
},{ collection: 'user' });

// Hash the password before saving it to MongoDB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
userSchema.set('collection', 'user');
module.exports = mongoose.model('User', userSchema,'user');