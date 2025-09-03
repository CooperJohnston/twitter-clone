"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class FollowService {
    authDAO;
    followsDAO;
    constructor(daoFactory) {
        this.authDAO = daoFactory.getAuthTokenDAO();
        this.followsDAO = daoFactory.getFollowDAO();
    }
    async loadMoreFollowers(token, userAlias, pageSize, lastItem) {
        // TODO: Replace with the result of calling server
        let auth = await this.authDAO.checkAuthToken(token);
        if (!auth) {
            throw new Error("Invalid auth token");
        }
        let response = await this.followsDAO.getPageOfFollowers(userAlias, pageSize, lastItem?.alias || undefined);
        return [response.values.map((user) => user.dto), response.hasMore];
    }
    ;
    async loadMoreFollowees(token, userAlias, pageSize, lastItem) {
        // TODO: Replace with the result of calling server
        let auth = await this.authDAO.checkAuthToken(token);
        if (!auth) {
            throw new Error("Invalid auth token");
        }
        let response = await this.followsDAO.getPageOfFollowees(userAlias, pageSize, lastItem?.alias || undefined);
        return [response.values.map((user) => user.dto), response.hasMore];
    }
    ;
    async getFolloweeCount(follow) {
        // TODO: Replace with the result of calling server
        const newFollow = tweeter_shared_1.Follow.fromJson(JSON.stringify(follow));
        if (!newFollow || !newFollow?.follower || !newFollow?.followee || !newFollow?.follower.alias) {
            throw new Error("[Bad Request] Could not parse follow object");
        }
        return await this.followsDAO.getNumFollowees(newFollow.follower.alias);
    }
    ;
    async getFollowerCount(follow) {
        // TODO: Replace with the result of calling server
        const newFollow = tweeter_shared_1.Follow.fromJson(JSON.stringify(follow));
        if (!newFollow || !newFollow?.follower || !newFollow?.followee) {
            throw new Error("[Bad Request] Could not parse follow object");
        }
        return await this.followsDAO.getNumFollowers(newFollow.follower.alias);
    }
    ;
    async getIsFollowerStatus(authToken, user, selectedUser) {
        // TODO: Replace with the result of calling server
        let currentUser = tweeter_shared_1.User.fromJson(JSON.stringify(user));
        let secondUser = tweeter_shared_1.User.fromJson(JSON.stringify(selectedUser));
        return await this.followsDAO.getFollow(new tweeter_shared_1.Follow(currentUser, secondUser)) !== undefined;
    }
    ;
    async unfollow(authToken, follow) {
        // Pause so we can see the unfollow message. Remove when connected to the server
        let auth = await this.authDAO.checkAuthToken(authToken);
        if (!auth) {
            throw new Error("Invalid auth token");
        }
        let newFollow = tweeter_shared_1.Follow.fromJson(JSON.stringify(follow));
        await this.followsDAO.removeFollow(newFollow);
        const followerCount = await this.followsDAO.getNumFollowers(newFollow.followee.alias);
        const followeeCount = await this.followsDAO.getNumFollowers(newFollow.followee.alias);
        return [followerCount, followeeCount];
    }
    ;
    async follow(authToken, follow) {
        let auth = await this.authDAO.checkAuthToken(authToken);
        if (!auth) {
            throw new Error("Invalid auth token");
        }
        let newFollow = tweeter_shared_1.Follow.fromJson(JSON.stringify(follow));
        console.log("new_follow" + JSON.stringify(newFollow));
        await this.followsDAO.addFollow(newFollow);
        // probably need to fix this later so i am calling the right method
        const followerCount = await this.followsDAO.getNumFollowers(newFollow.followee.alias);
        const followeeCount = await this.followsDAO.getNumFollowers(newFollow.followee.alias);
        return [followerCount, followeeCount];
    }
    ;
}
exports.FollowService = FollowService;
