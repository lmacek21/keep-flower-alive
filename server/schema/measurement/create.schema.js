module.exports = {
  type: "object",
  properties: {
    roomId: { type: "string", minLength: 1 },
    value: { type: "number" },
    unit: { type: "string" },
  },
  required: ["roomId", "value", "unit"],
  additionalProperties: false,
};
