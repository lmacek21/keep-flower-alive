module.exports = {
  type: "object",
  properties: {
    sensorId: { type: "string", minLength: 1 },
    temperature: { type: "number" },
    measuredAt: { type: "string", minLength: 1 },
  },
  required: ["sensorId", "temperature", "measuredAt"],
  additionalProperties: false,
};
