"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbDaoFactory = void 0;
const AuthTokenDb_1 = require("./AuthTokenDb");
const FeedDB_1 = require("./FeedDB");
const FollowsDB_1 = require("./FollowsDB");
const S3Image_1 = require("./S3Image");
const StatusDb_1 = require("./StatusDb");
const UserDb_1 = require("./UserDb");
class DbDaoFactory {
    getAuthTokenDAO() {
        return new AuthTokenDb_1.AuthTokenDB();
    }
    getUserDAO() {
        return new UserDb_1.UserDB();
    }
    getImageDAO() {
        return new S3Image_1.S3ImageDAO();
    }
    getFollowDAO() {
        return new FollowsDB_1.FollowsDB();
    }
    getStatusDAO() {
        return new StatusDb_1.StatusDB();
    }
    getFeedDAO() {
        return new FeedDB_1.FeedDB();
    }
}
exports.DbDaoFactory = DbDaoFactory;
