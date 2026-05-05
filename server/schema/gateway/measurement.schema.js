module.exports = {
    type: "object",
    properties: {
        uniqueDeviceId: { type: "string", minLength: 1 },
        temperature: { type: "number" },
        measuredAt: { type: "string", format: "date-time" },
    },
    required: ["uniqueDeviceId", "temperature"],
    additionalProperties: false,
};