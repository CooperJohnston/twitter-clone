"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class UserService {
    userDAO;
    authDAO;
    imageDAO;
    constructor(daoFactory) {
        this.userDAO = daoFactory.getUserDAO();
        this.authDAO = daoFactory.getAuthTokenDAO();
        this.imageDAO = daoFactory.getImageDAO();
    }
    async register(firstName, lastName, alias, password, userImageString, imageFileExtension) {
        // Not neded now, but will be needed when you make the request to the server in milestone 3
        let userImage = await this.imageDAO.putImage(alias + "_pfp", userImageString);
        // TODO: Replace with the result of calling the server
        let user = new tweeter_shared_1.User(firstName, lastName, alias, userImage, password);
        let result = await this.userDAO.createUser(user);
        if (result === false) {
            throw new Error("Invalid registration");
        }
        const userData = user.dto;
        let authToken = await this.authDAO.createAuthToken(tweeter_shared_1.AuthToken.Generate(), alias);
        return [userData, authToken.token];
    }
    ;
    async login(alias, password) {
        // TODO: Replace with the result of calling the server
        let user = await this.userDAO.loginUser(alias, password);
        if (user === null) {
            throw new Error("Invalid alias or password");
        }
        let authToken = await this.authDAO.createAuthToken(tweeter_shared_1.AuthToken.Generate(), alias);
        const userData = user.dto;
        return [userData, authToken.token];
    }
    ;
    async logout(authToken) {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        await this.authDAO.deleteAuthToken(authToken);
    }
    ;
    async getUser(authToken, alias) {
        // TODO: Replace with the result of calling server
        let authorization = await this.authDAO.checkAuthToken(authToken);
        if (authorization === false) {
            throw new Error("Invalid authorization");
        }
        let user = await this.userDAO.getUser(alias);
        return user?.dto || null;
    }
    ;
}
exports.UserService = UserService;
