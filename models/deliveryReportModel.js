// deliveryReportModel.js
const mongoose = require('mongoose');

const deliveryReportSchema = new mongoose.Schema({
    deliveryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Delivery', 
        required: true
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    status: {
        type: String,
        enum: ['Delivered', 'Not Delivered'],
        required: true
    },
    comments: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const DeliveryReport = mongoose.model('DeliveryReport', deliveryReportSchema);

module.exports = DeliveryReport;
