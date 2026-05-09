module.exports = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1 },
    description: { type: "string" },
    minTemp: { type: "number" },
    maxTemp: { type: "number" },
    image: { type: "string" },
  },
  required: ["name"],
  additionalProperties: false,
};
