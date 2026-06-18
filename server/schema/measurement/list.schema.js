module.exports = {
  type: "object",
  properties: {
    roomId: { type: "string", minLength: 1 },
    startDate: { type: "string", format: "date-time" },
    endDate: { type: "string", format: "date-time" },
  },
  required: ["roomId"],
  additionalProperties: false,
};
