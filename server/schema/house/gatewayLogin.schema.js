module.exports = {
  type: "object",
  properties: {
    secret: { type: "string", minLength: 1 },
  },
  required: ["secret"],
  additionalProperties: false,
};
