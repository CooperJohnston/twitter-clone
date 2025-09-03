import { GetFollowRequest, InspectionResponse, UserInspectionRequest, UserItemRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DbDaoFactory } from "../../model/dao/db/DbDaoFactory";

export const handler = async (event: GetFollowRequest): Promise<InspectionResponse> => {
   const service = new FollowService(new DbDaoFactory());
    const isFollower = await service.getIsFollowerStatus(event.token, event.user, event.selectedUser);
    return {
        success: true,
        message: "Follow status",
        isFollower: isFollower
    }

}