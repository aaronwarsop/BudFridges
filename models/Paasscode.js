const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const passcodeSchema = new Schema({
    driverId: {
        type: String,
        required: true
    },
    passcode: {
        type: String,
        required: true
    }
});


const Passcode = mongoose.model('Passcode', passcodeSchema);

module.exports = Passcode;
