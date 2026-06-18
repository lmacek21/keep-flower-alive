module.exports = {
  type: "object",
  properties: {
    email: { type: "string", minLength: 1 },
  },
  required: ["email"],
  additionalProperties: false,
};
