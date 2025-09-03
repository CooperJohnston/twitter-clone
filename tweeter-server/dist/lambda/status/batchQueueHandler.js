"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const DbDaoFactory_1 = require("../../model/dao/db/DbDaoFactory");
const StatusService_1 = require("../../model/service/StatusService");
const handler = async (event) => {
    for (let i = 0; i < event.Records.length; ++i) {
        const { body } = event.Records[i];
        await new StatusService_1.StatusService(new DbDaoFactory_1.DbDaoFactory()).batchUploadToFeeds(JSON.parse(body));
    }
};
exports.handler = handler;
