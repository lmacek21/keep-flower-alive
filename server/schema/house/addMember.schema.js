module.exports = {
  type: "object",
  properties: {
    houseId: { type: "string", minLength: 1 },
    memberId: { type: "string", minLength: 1 },
  },
  required: ["houseId", "memberId"],
  additionalProperties: false,
};
