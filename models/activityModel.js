const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    status: {
        type: String
    },
    itemId: {
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

const activity = mongoose.model("activity", activitySchema);
module.exports = activity;