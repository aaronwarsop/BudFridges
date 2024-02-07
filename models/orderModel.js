const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    orderId: {
        type: Number
    },
    name:{
        type: String
    },
    quantity: {
        type: Number
    },
    expiryDate: {
        type: String
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

const orderItem = mongoose.model("orderItem", orderItemSchema);
module.exports = orderItem;