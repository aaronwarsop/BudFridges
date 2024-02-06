const mongoose = require('mongoose');

const damagedItemSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FridgeItem', 
        required: true
    },
    description: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const DamagedItem = mongoose.model('DamagedItem', damagedItemSchema);

module.exports = DamagedItem;
