module.exports = {
  type: "object",
  properties: {
    roomId: { type: "string", minLength: 1 },
  },
  required: ["roomId"],
  additionalProperties: false,
};
