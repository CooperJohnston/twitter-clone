"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../../model/service/FollowService");
const DbDaoFactory_1 = require("../../model/dao/db/DbDaoFactory");
const handler = async (event) => {
    const service = new FollowService_1.FollowService(new DbDaoFactory_1.DbDaoFactory());
    const isFollower = await service.getIsFollowerStatus(event.token, event.user, event.selectedUser);
    return {
        success: true,
        message: "Follow status",
        isFollower: isFollower
    };
};
exports.handler = handler;
