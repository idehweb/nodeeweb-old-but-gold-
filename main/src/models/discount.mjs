import mongoose from 'mongoose';
const DiscountSchema = new mongoose.Schema({
    name: {},
    slug: {
        type: String,
        required: false,
        trim: true
    },
    price: Number,
    percent: Number,
    count: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
// module.exports = mongoose.model('Category', CategorySchema);
export default mongoose.model('Discount', DiscountSchema);