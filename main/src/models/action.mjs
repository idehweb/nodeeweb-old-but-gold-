import mongoose from "mongoose";

const ActionSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  data: {},
  history: {},
  task: {},
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" }, //category_id
  comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" }, //category_id
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //category_id
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, //category_id
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }, //category_id
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }, //category_id
  settings: { type: mongoose.Schema.Types.ObjectId, ref: "Settings" }, //category_id
  sms: { type: mongoose.Schema.Types.ObjectId, ref: "Sms" } //category_id
});
// module.exports = mongoose.model('Action', ActionSchema);
export default mongoose.model("Action", ActionSchema);