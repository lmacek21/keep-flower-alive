module.exports = {
    type: "object",
    properties: {
        roomId: { type: "string", minLength: 1 },
        uniqueGatewayId: { type: "string", minLength: 1 },
        apiKey: { type: "string", minLength: 1 },
        status: { type: "string" },
    },
    required: ["roomId", "uniqueGatewayId", "apiKey"],
    additionalProperties: false,
};