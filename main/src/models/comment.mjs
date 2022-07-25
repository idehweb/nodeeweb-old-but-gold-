import mongoose from 'mongoose';
const CommentSchema = new mongoose.Schema({
  rate: Number,
  text: {},
  customer:{type: mongoose.Schema.Types.ObjectId, ref: 'Customer'},
  product:{type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
  post:{type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  status: {type: String, default: 'processing'},

});
// module.exports = mongoose.model('Category', CategorySchema);
export default mongoose.model('Comment', CommentSchema);