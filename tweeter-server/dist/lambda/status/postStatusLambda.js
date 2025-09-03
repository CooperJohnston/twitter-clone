"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const StatusService_1 = require("../../model/service/StatusService");
const DbDaoFactory_1 = require("../../model/dao/db/DbDaoFactory");
const handler = async (request) => {
    const service = new StatusService_1.StatusService(new DbDaoFactory_1.DbDaoFactory());
    await service.postStatus(request.token, request.status);
    return;
};
exports.handler = handler;
