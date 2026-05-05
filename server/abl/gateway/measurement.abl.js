const ajv = require("../../utils/ajv.util");
const GatewayDao = require("../../dao/gateway.dao");
const MeasurementDao = require("../../dao/measurement.dao");
const schema = require("../../schema/gateway/measurement.schema");

const validate = ajv.compile(schema);

async function receiveGatewayMeasurement(req, res) {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
        return res.status(401).json({ error: "Missing API key" });
    }

    const body = req.body;

    if (!validate(body)) {
        return res.status(400).json({
            error: "Validation failed",
            details: validate.errors,
        });
    }

    try {
        const gateway = await GatewayDao.getByApiKey(apiKey);

        if (!gateway) {
            return res.status(401).json({
                error: "Invalid API key or gateway not found",
            });
        }

        const measuredAt = body.measuredAt ? new Date(body.measuredAt) : new Date();

        const measurement = await MeasurementDao.create({
            roomId: gateway.roomId,
            value: body.temperature,
            unit: "C",
        });

        await GatewayDao.updateLatestData(gateway._id, measuredAt);

        return res.status(201).json({
            message: "Measurement received successfully",
            data: {
                gatewayId: gateway._id,
                uniqueGatewayId: gateway.uniqueGatewayId,
                uniqueDeviceId: body.uniqueDeviceId,
                measurementId: measurement._id,
                roomId: gateway.roomId,
                temperature: measurement.value,
                unit: measurement.unit,
                measuredAt: measurement.createdAt,
            },
        });

    } catch (err) {
        return res.status(500).json({
            error: "Internal server error",
            details: err.message,
        });
    }
}

module.exports = receiveGatewayMeasurement;