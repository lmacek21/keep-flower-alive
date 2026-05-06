module.exports = {
  type: "object",
  required: ["name"],   // ✅ REQUIRE NAME
  properties: {
    name: { type: "string" }
  },
  additionalProperties: false
};