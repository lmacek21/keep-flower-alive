const mongoose = require("mongoose");

const gatewaySchema = new mongoose.Schema(
    {
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        },
        uniqueGatewayId: {
            type: String,
            required: true,
            unique: true,
        },
        apiKey: {
            type: String,
            required: true,
            unique: true,
        },
        status: {
            type: String,
            default: "ONLINE",
        },
        latestDataFromGateway: {
            type: Date,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Gateway", gatewaySchema);