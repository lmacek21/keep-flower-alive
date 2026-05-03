module.exports = {
  type: "object",
  properties: {
    roomId: { type: "string", minLength: 1 },
    status: { type: "string" },
  },
  required: ["roomId"],
  additionalProperties: false,
};
