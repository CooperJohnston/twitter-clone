"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const DbDaoFactory_1 = require("../../model/dao/db/DbDaoFactory");
const StatusService_1 = require("../../model/service/StatusService");
const handler = async (event) => {
    console.log("Processing SQS event:", JSON.stringify(event, null, 2));
    const service = new StatusService_1.StatusService(new DbDaoFactory_1.DbDaoFactory());
    for (const record of event.Records) {
        const statusJson = record.body; // This is a string
        const status = tweeter_shared_1.Status.fromJson(statusJson); // Convert to Status object
        if (!status) {
            console.error("[Bad Request] Invalid status in queue message");
            continue;
        }
        try {
            await service.addToFeeds(status);
        }
        catch (e) {
            console.error("Failed to add status to feeds:", e);
        }
    }
};
exports.handler = handler;
