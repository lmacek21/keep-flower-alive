module.exports = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1 },
    houseId: { type: "string", minLength: 1 },
  },
  required: ["name", "houseId"],
  additionalProperties: false,
};
