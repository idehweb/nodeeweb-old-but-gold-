import mongoose from 'mongoose';
const NotificationSchema = new mongoose.Schema({
    title: String,
    text: String,
    createdAt: {type: Date, default: Date.now},
});

// module.exports = mongoose.model('Notification', NotificationSchema);
export default mongoose.model('Notification', NotificationSchema);
