import mongoose from 'mongoose';

import User from './User';
import Comment from './Comment';
const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: 120,
    required: true,
  },
  user: {
    type: ObjectId,
    ref: 'User',
    description: 'User that created this post',
    required: true,
  },
  slug: {
    type: String,
    indexed: true,
    description: 'Used for SEO',
  },
  comments: [
    {
      type: ObjectId,
      ref: 'Comment',
    },
  ],
  tags: [String],
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  collection: 'post',
});

export default mongoose.model('Post', Schema);
