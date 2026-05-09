module.exports = {
  type: "object",
  properties: {
    sensorId: { type: "string", minLength: 1 },
    houseId: { type: "string", minLength: 1 },
  },
  required: ["sensorId", "houseId"],
  additionalProperties: false,
};
