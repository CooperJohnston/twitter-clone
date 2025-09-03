"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../../model/service/FollowService");
const DbDaoFactory_1 = require("../../model/dao/db/DbDaoFactory");
const handler = async (request) => {
    const service = new FollowService_1.FollowService(new DbDaoFactory_1.DbDaoFactory());
    const [items, hasMore] = await service.loadMoreFollowees(request.token, request.alias, request.pageSize, request.lastItem);
    return {
        success: true,
        message: "Success",
        items: items,
        hasMore: hasMore
    };
};
exports.handler = handler;
