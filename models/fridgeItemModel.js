const mongoose = require("mongoose");

const fridgeItemSchema = new mongoose.Schema({
    name:{
        type: String
    },
    quantity: {
        type: Number
    },
    expiryDate: {
        type: Date
    },
    username: {
        type: String
    },
    role: {
        type: String
    }
},
{
    timestamps: true
}
);

const fridgeItem = mongoose.model("fridgeItem", fridgeItemSchema);
module.exports = fridgeItem;