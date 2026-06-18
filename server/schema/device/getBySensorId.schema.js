module.exports = {
  type: "object",
  properties: {
    sensorId: { type: "string", minLength: 1 },
  },
  required: ["sensorId"],
  additionalProperties: false,
};
