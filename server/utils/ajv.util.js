const { default: Ajv } = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv();
addFormats(ajv);

module.exports = ajv;
