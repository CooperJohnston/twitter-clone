"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UserService_1 = require("../../model/service/UserService");
const DbDaoFactory_1 = require("../../model/dao/db/DbDaoFactory");
const handler = async (event) => {
    const service = new UserService_1.UserService(new DbDaoFactory_1.DbDaoFactory());
    const [user, authToken] = await service.register(event.firstName, event.lastName, event.alias, event.password, event.imageString, event.imageFileExtension);
    return {
        success: true,
        message: "User registered",
        user: user,
        authToken: authToken
    };
};
exports.handler = handler;
