module.exports = {
  type: "object",
  properties: {
    roomId: { type: "string", minLength: 1 },
    flowerId: { type: "string", minLength: 1 },
  },
  required: ["roomId", "flowerId"],
  additionalProperties: false,
};
