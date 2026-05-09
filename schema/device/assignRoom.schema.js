module.exports = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 1 },
    roomId: { type: "string", minLength: 1 },
  },
  required: ["id", "roomId"],
  additionalProperties: false,
};
