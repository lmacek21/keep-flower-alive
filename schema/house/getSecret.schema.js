module.exports = {
  type: "object",
  properties: {
    houseId: { type: "string", minLength: 1 },
  },
  required: ["houseId"],
  additionalProperties: false,
};
