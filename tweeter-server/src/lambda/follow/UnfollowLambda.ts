import { FollowRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DoubleCountResponse } from "tweeter-shared";
import { DbDaoFactory } from "../../model/dao/db/DbDaoFactory";

export const handler = async (request: FollowRequest): Promise<DoubleCountResponse> => {
    const service = new FollowService(new DbDaoFactory());
    const [followeeCount, followerCount] = await service.unfollow(request.token, request.follow);
    return {
        success: true,
        message: "Followee and Follower count",
        count: followeeCount,
        count2: followerCount
    }


}