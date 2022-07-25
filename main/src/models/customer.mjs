import mongoose from "mongoose";
import bcrypt from "bcrypt";

const CustomerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
    trim: true
  },
  phoneNumber: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  nickname: {
    type: String
  },
  firstName: String,
  lastName: String,
  internationalCode: String,
  sex: String,
  bankData: {},
  wishlist: [{ _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" } }],
  password: String,
  age: { type: Number },
  whatsapp: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  activationCode: Number,
  tokens: [{ token: String, os: String }],
  notificationTokens: [{ token: String, updatedAt: { type: Date, default: Date.now } }],
  credit: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  score: { type: Number, default: 0 },
  invitationCode: Number,
  invitation_list: [{
    customer_id: String
  }],
  photos: [{
    name: String,
    url: String
  }],
  address: []
});

//authenticate input against database
CustomerSchema.statics.authenticate = function(phoneNumber, password, callback) {
  const Customer = mongoose.model("Customer", CustomerSchema);
  Customer.findOne({ phoneNumber: phoneNumber }, "photos , nickname , firstName , lastName , email , password , tokens  , phoneNumber , address , authCustomerWithPassword , internationalCode").lean()
    .exec(function(err, user) {
      if (err) {
        return callback(err);
      } else if (!user) {
        let err = new Error("User not found.");
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function(err, result) {
        if (result === true) {
          delete user.password;
          // var token='';
          if (user.tokens && user.tokens.length) {
            user.token = user.tokens[user.tokens.length - 1].token;
          }
          delete user.tokens;

          return callback(null, user);
        } else {
          return callback();
        }
      });
    });
};
//
// //hashing a password before saving it to the database
// CustomerSchema.pre('save', function (next) {
//     let customer = this;
//     console.log('presave',customer.password);
//     bcrypt.hash(customer.password, 10, function (err, hash) {
//         if (err) {
//             return next(err);
//         }
//         console.log('aftersave');
//         customer.password = hash;
//         next();
//     })
// });


// module.exports = mongoose.model('Customer', CustomerSchema);
export default mongoose.model("Customer", CustomerSchema);
