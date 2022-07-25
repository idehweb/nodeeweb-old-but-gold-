import mongoose from 'mongoose';
const LinkSchema = new mongoose.Schema({
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  views: [],
  unicViews: [],
  sales: [{
    order_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Order'}, //category_id
    transaction_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Transaction'}, //category_id
    income: Number
  }],
  income: Number,
  kind: {type: String, default: 'post'},
  redirectTo: String,
  parent: {type: mongoose.Schema.Types.ObjectId, ref: 'Link'}, //category_id
  customer: {type: mongoose.Schema.Types.ObjectId, ref: 'Customer'} //category_id
});
// module.exports = mongoose.model('Link', LinkSchema);
export default mongoose.model('Link', LinkSchema);
