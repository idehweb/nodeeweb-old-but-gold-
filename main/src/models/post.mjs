console.log('# post')

import mongoose from 'mongoose';
const PostSchema = new mongoose.Schema({
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  active: {type: Boolean, default: true},
  firstCategory: {type: mongoose.Schema.Types.ObjectId, ref: 'PostCategory'},
  secondCategory: {type: mongoose.Schema.Types.ObjectId, ref: 'PostCategory'},
  thirdCategory: {type: mongoose.Schema.Types.ObjectId, ref: 'PostCategory'},
  data: {},
  description: {},
  excerpt: {},
  views: [],
  slug: String,
  title: {},
  elements: {},
  kind: {type: String, default: 'post'},
  status: {type: String, default: 'processing'},
  photos: [],
  thumbnail: String,

});

export default mongoose.model('Post', PostSchema);
