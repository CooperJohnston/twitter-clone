"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../../model/service/FollowService");
const DbDaoFactory_1 = require("../../model/dao/db/DbDaoFactory");
const handler = async (request) => {
    const service = new FollowService_1.FollowService(new DbDaoFactory_1.DbDaoFactory());
    const count = await service.getFollowerCount(request.follow);
    return {
        success: true,
        message: "Follower count",
        count: count
    };
};
exports.handler = handler;
