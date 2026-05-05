const ajv = require("../../utils/ajv.util");
const GatewayDao = require("../../dao/gateway.dao");
const schema = require("../../schema/gateway/create.schema");

const validate = ajv.compile(schema);

async function createGateway(req, res) {
    const body = req.body;

    if (!validate(body)) {
        return res.status(400).json({
            error: "Validation failed",
            details: validate.errors,
        });
    }

    try {
        const gateway = await GatewayDao.create(body);

        return res.status(201).json(gateway);
    } catch (err) {
        return res.status(500).json({
            error: "Internal server error",
            details: err.message,
        });
    }
}

module.exports = createGateway;