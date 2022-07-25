import mongoose from 'mongoose';
const MediaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: false
    },
    theKey: {
        type: String,
        required: false,
    },
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});
// module.exports = mongoose.model('Media', MediaSchema);
export default mongoose.model('Media', MediaSchema);
