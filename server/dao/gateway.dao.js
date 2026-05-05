const Gateway = require("../models/gateway.model");

const GatewayDao = {
    create: (data) => Gateway.create(data),
    deleteById: (id) => Gateway.findByIdAndDelete(id),
    getByApiKey: (apiKey) => Gateway.findOne({ apiKey }),
    getByUniqueGatewayId: (uniqueGatewayId) => Gateway.findOne({ uniqueGatewayId }),
    updateLatestData: (id, measuredAt) =>
        Gateway.findByIdAndUpdate(
            id,
            {
                latestDataFromGateway: measuredAt,
                status: "ONLINE",
            },
            { returnDocument: "after" },
        ),
};

module.exports = GatewayDao;