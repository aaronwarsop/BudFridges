const mongoose = require("mongoose");

const healthAndSafetyReportSchema = new mongoose.Schema({
    Id: {
        type: Number
    },
    username: {
        type: String
    },
    role: {
        type: String
    },
    reportTitle: {
        type: String
    },
    reportInformation: {
        type: String
    }
},
{
    timestamps: true
}
);

const healthAndSafetyReportItem = mongoose.model("healthAndSafetyReportItem", healthAndSafetyReportSchema);
module.exports = healthAndSafetyReportItem;