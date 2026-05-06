module.exports = {
  type: "object",
  properties: {
    roomId: { type: "string", minLength: 1 },
    name: { type: "string" },
    status: { type: "string" },
  },
  required: ["roomId"],
  additionalProperties: false,
};
