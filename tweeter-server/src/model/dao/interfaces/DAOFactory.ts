import { AuthTokenDAO } from "./AuthTokenDAO";
import { FeedsDAO } from "./FeedDAO";
import { FollowsDAO } from "./FollowsDAO";
import { ImageDAO } from "./ImageDAO";
import { StatusesDAO } from "./StatusDAO";
import { UserDAO } from "./UserDAO";

export interface DAOFactory {
    getAuthTokenDAO(): AuthTokenDAO;
    getUserDAO(): UserDAO;
    getImageDAO(): ImageDAO;
    getFollowDAO(): FollowsDAO;
    getStatusDAO(): StatusesDAO;
    getFeedDAO(): FeedsDAO;

}