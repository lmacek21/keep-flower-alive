module.exports = {
  type: "object",
  properties: {
    ownerId: { type: "string", minLength: 1 },
  },
  required: ["ownerId"],
  additionalProperties: false,
};
