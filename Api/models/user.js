const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 128 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    active: { type: Boolean, default: true },
    accessToken: { type: String, default: '' },
    lastLogin: Date
  },
  { timestamps: true }
);

schema.pre('save', async function (next) {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 10);
  next();
});

schema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

schema.methods.toPublic = function () {
  return { _id: this._id, name: this.name, email: this.email };
};

module.exports = mongoose.models.User || mongoose.model('User', schema);
