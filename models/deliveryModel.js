// deliveryModel.js
const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipientName: {
        type: String,
        required: true
    },
    recipientAddress: {
        type: String,
        required: true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FridgeItem'
    }],
    deliveryDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
});

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
