module.exports = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 1 },
    name: { type: "string", minLength: 1 },
    description: { type: "string" },
    minTemp: { type: "number" },
    maxTemp: { type: "number" },
    image: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};
