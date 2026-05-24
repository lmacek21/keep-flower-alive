module.exports = {
    type: "object",
    properties: {
        measurementId: { type: "string", minLength: 1 },
        uniqueDeviceId: { type: "string", minLength: 1 },
        temperature: {
            type: "number",
            minimum: -40,
            maximum: 80,
        },
        measuredAt: { type: "string", format: "date-time" },
    },
    required: ["measurementId", "uniqueDeviceId", "temperature", "measuredAt"],
    additionalProperties: false,
};