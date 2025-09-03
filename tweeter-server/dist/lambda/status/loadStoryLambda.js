"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const StatusService_1 = require("../../model/service/StatusService");
const DbDaoFactory_1 = require("../../model/dao/db/DbDaoFactory");
const handler = async (request) => {
    const service = new StatusService_1.StatusService(new DbDaoFactory_1.DbDaoFactory());
    const [statusList, hasMore] = await service.loadMoreStoryItems(request.token, request.alias, request.pageSize, request.lastItem);
    return {
        success: true,
        message: "Success",
        statusList: statusList,
        hasMore: hasMore
    };
};
exports.handler = handler;
