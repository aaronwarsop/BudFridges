const mongoose = require("mongoose");

const fridgeItemSchema = new mongoose.Schema({
    itemId: { 
        type: String, 
        unique: true
    },
    name:{
        type: String
    },
    quantity: {
        type: Number
    },
    expiryDate: {
        type: Date
    }
},
{
    timestamps: true
}
);

const fridgeItem = mongoose.model("fridgeItem", fridgeItemSchema);
module.exports = fridgeItem;