import mongoose from 'mongoose';
const MenuSchema = new mongoose.Schema({
    name: {},
    slug: {
        type: String,
        required: false,
        trim: true
    },
    image: String,
    order: Number,
    kind: String,
    link: String,
    icon: String,
    data: {},
    parent:{type: mongoose.Schema.Types.ObjectId, ref: 'Menu'} //menu_id
});
// module.exports = mongoose.model('Category', CategorySchema);
export default mongoose.model('Menu', MenuSchema);