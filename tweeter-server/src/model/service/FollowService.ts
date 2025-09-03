import { AuthToken, User,  UserDTO, Follow } from "tweeter-shared";
import { AuthTokenDAO } from "../dao/interfaces/AuthTokenDAO";
import { FollowsDAO } from "../dao/interfaces/FollowsDAO";
import { DAOFactory } from "../dao/interfaces/DAOFactory";

export class FollowService {
    private authDAO: AuthTokenDAO;
    private followsDAO: FollowsDAO;

    constructor(daoFactory: DAOFactory) {
        this.authDAO = daoFactory.getAuthTokenDAO();
        this.followsDAO = daoFactory.getFollowDAO();
      }

    public async loadMoreFollowers (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDTO | null
      ): Promise<[UserDTO[], boolean]>{
        // TODO: Replace with the result of calling server
        let auth = await this.authDAO.checkAuthToken(token);
        if (!auth) {
          throw new Error("Invalid auth token");
        }
    
        let response = await this.followsDAO.getPageOfFollowers(userAlias, pageSize, lastItem?.alias || undefined);
        return [response.values.map((user) => user.dto), response.hasMore];
      };

      
    
    public async loadMoreFollowees (
      token: string,
      userAlias: string,
      pageSize: number,
      lastItem: UserDTO | null
    ): Promise<[UserDTO[], boolean]>{
        // TODO: Replace with the result of calling server
        let auth = await this.authDAO.checkAuthToken(token);
        if (!auth) {
          throw new Error("Invalid auth token");
        }
        let response = await this.followsDAO.getPageOfFollowees(userAlias, pageSize, lastItem?.alias || undefined);
        return [response.values.map((user) => user.dto), response.hasMore];
      };


      public async getFolloweeCount  (
        follow: Follow
      ): Promise<number>  {

        // TODO: Replace with the result of calling server
        const newFollow  = Follow.fromJson(JSON.stringify(follow));
        if (!newFollow || !newFollow?.follower || !newFollow?.followee || !newFollow?.follower.alias) {
          throw new Error("[Bad Request] Could not parse follow object")
        }
        return await this.followsDAO.getNumFollowees(newFollow.follower.alias);
      };

      public async getFollowerCount  (
        follow: Follow
      ): Promise<number>  {
        
        // TODO: Replace with the result of calling server
        const newFollow  = Follow.fromJson(JSON.stringify(follow));
        if (!newFollow || !newFollow?.follower || !newFollow?.followee) {
          throw new Error("[Bad Request] Could not parse follow object")
        }
        return await this.followsDAO.getNumFollowers(newFollow!.follower.alias);
      };

      public async getIsFollowerStatus (
        authToken: string,
        user: User,
        selectedUser: User
      ): Promise<boolean>  {
        // TODO: Replace with the result of calling server
        let currentUser = User.fromJson(JSON.stringify(user));
        let secondUser = User.fromJson(JSON.stringify(selectedUser));
        return await this.followsDAO.getFollow(new Follow(currentUser!, secondUser!)) !== undefined
      };

      public async unfollow (
        authToken: string,
        follow: Follow
      ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the unfollow message. Remove when connected to the server
        let auth = await this.authDAO.checkAuthToken(authToken);
        if (!auth) {
          throw new Error("Invalid auth token");
        }
        let newFollow = Follow.fromJson(JSON.stringify(follow));
        await this.followsDAO.removeFollow(newFollow!);
        const followerCount = await this.followsDAO.getNumFollowers(newFollow!.followee.alias);
        const followeeCount = await this.followsDAO.getNumFollowers(newFollow!.followee.alias);
        return [followerCount, followeeCount];
      };

      public async follow (
        authToken: string,
        follow: Follow
      ): Promise<[followerCount: number, followeeCount: number]> {
        let auth = await this.authDAO.checkAuthToken(authToken);
        if (!auth) {
          throw new Error("Invalid auth token");

        }
        
        let newFollow = Follow.fromJson(JSON.stringify(follow));
        console.log("new_follow"+JSON.stringify(newFollow))
        await this.followsDAO.addFollow(newFollow!);
        // probably need to fix this later so i am calling the right method
        const followerCount = await this.followsDAO.getNumFollowers(newFollow!.followee.alias);
        const followeeCount = await this.followsDAO.getNumFollowers(newFollow!.followee.alias);
        return [followerCount, followeeCount];
      };

    
}