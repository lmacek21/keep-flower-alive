const mongoose = require("mongoose");

const measurementSchema = new mongoose.Schema(
    {
        measurementId: {
            type: String,
            required: true,
            unique: true,
        },
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        },
        uniqueDeviceId: {
            type: String,
            required: true,
        },
        value: {
            type: Number,
            required: true,
        },
        unit: {
            type: String,
            required: true,
            default: "C",
        },
        measuredAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Measurement", measurementSchema);