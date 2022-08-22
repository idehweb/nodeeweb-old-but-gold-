console.log('# postCategory')

import mongoose from 'mongoose';
const PostCategorySchema = new mongoose.Schema({
    name: {},
    slug: {
        type: String,
        required: false,
        trim: true
    },
    image: String,
    order: Number,
    data: {},
    parent:{type: mongoose.Schema.Types.ObjectId, ref: 'PostCategory'} //category_id
});
// module.exports = mongoose.model('Category', CategorySchema);
export default mongoose.model('PostCategory', PostCategorySchema);