const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {type: String, required: true, maxLength: 24, unique: true},
    password: {type: String, required: true, maxLength: 100},
    is_member: {type: Boolean},
    is_admin: {type: Boolean, required: true},
  }
);

module.exports = mongoose.model('User', UserSchema);
