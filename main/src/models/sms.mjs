import mongoose from 'mongoose';
const SmsSchema = new mongoose.Schema({
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  message: String,
  status:{type:String,default:'unsend'},
  phoneNumber: String,
  from: String,
  customer: {type: mongoose.Schema.Types.ObjectId, ref: 'Customer'} //category_id
});
// module.exports = mongoose.model('Sms', SmsSchema);
export default mongoose.model('Sms', SmsSchema);
