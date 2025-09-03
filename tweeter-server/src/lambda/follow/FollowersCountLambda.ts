import { FollowService } from "../../model/service/FollowService";
import { FollowRequest } from "tweeter-shared";
import { CountResponse } from "tweeter-shared";
import { DbDaoFactory } from "../../model/dao/db/DbDaoFactory";

export const handler = async (request: FollowRequest): Promise<CountResponse> => {
    const service = new FollowService(new DbDaoFactory());
    const count = await service.getFollowerCount(request.follow);
    return {
        success: true,
        message: "Follower count",
        count: count
    }

};