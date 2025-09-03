import { AuthTokenDAO } from "../interfaces/AuthTokenDAO";
import { DAOFactory } from "../interfaces/DAOFactory";
import { FeedsDAO } from "../interfaces/FeedDAO";
import { FollowsDAO } from "../interfaces/FollowsDAO";
import { ImageDAO } from "../interfaces/ImageDAO";
import { StatusesDAO } from "../interfaces/StatusDAO";
import { UserDAO } from "../interfaces/UserDAO";
import { AuthTokenDB } from "./AuthTokenDb";
import { FeedDB } from "./FeedDB";
import { FollowsDB } from "./FollowsDB";
import { S3ImageDAO } from "./S3Image";
import { StatusDB } from "./StatusDb";
import { UserDB } from "./UserDb";

export class DbDaoFactory implements DAOFactory{
    getAuthTokenDAO(): AuthTokenDAO {
        return new AuthTokenDB()
    }
    getUserDAO(): UserDAO {
       return new UserDB()
    }
    getImageDAO(): ImageDAO {
        return new S3ImageDAO()
    }
    getFollowDAO(): FollowsDAO {
        return new FollowsDB()
    }
    getStatusDAO(): StatusesDAO {
        return new StatusDB()
    }
    getFeedDAO(): FeedsDAO {
        return new FeedDB()
    }

}