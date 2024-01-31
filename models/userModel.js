const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter a username"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"]
    },
    role: {
        type: String,
    }
},
{   
    // adds timestamps of data inputted/edited
    timestamps: true
}
);

const User = mongoose.model("User", userSchema);
module.exports = User;