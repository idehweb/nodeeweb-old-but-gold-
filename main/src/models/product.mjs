console.log('# product')

import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  // mainCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  // mainCategory: {},

    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  // firstCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  // secondCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  // thirdCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  // catChoosed: [],
  // countryChoosed: [],
  sources: [],
  labels: [],
  // country: String,
  in_stock: { type: Boolean, default: false },
  story: { type: Boolean, default: false },
  price: Number,
  quantity: Number,
  salePrice: Number,
  // mainList: [],
  // mainCountryList: [],
  data: {},
  sku: String,
  miniTitle: {},
  excerpt: {},
  // categories: [],
  // theCategories: [],
  options: [],
  extra_attr: [],
  combinations: [],
  sections: [],
  countries: [],
  like: [{
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer"},
    userIp: String,
    createdAt: { type: Date, default: Date.now }
  }],
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  type: { type: String, default: "normal" },
  description: {},
  views: [],
  addToCard: [],
  // getContactData: [],
  title: {},
  metadescription: {},
  keywords: {},
  slug: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  thumbnail: String,
  status: { type: String, default: "processing" },
  transaction: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  photos: [],
  postNumber: String
});

// module.exports = mongoose.model('Product', ProductSchema);
export default mongoose.model("Product", ProductSchema);
