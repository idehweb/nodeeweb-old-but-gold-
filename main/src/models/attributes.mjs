import mongoose from 'mongoose';
const AttributesSchema = new mongoose.Schema({
    name: {},
    slug: {
        type: String,
        required: false,
        trim: true
    },
    type: {
      type: String,
      default: "normal"
    },
    image: String,
    data: {},
    values:[],
    parent:{type: mongoose.Schema.Types.ObjectId, ref: 'Attributes'} //category_id
});
// module.exports = mongoose.model('Attributes', AttributesSchema);
export default mongoose.model('Attributes', AttributesSchema);