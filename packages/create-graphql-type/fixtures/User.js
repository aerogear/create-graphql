// @flow
import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  name: {
    type: String,
    description: 'user name',
    required: true,
  },
  password: {
    type: String,
    description: 'hashed user password',
    hidden: true,
  },
  email: {
    type: String,
    required: false,
    description: 'user email',
    index: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  collection: 'user',
});

export default mongoose.model('User', Schema);
