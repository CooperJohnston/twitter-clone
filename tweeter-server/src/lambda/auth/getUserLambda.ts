import { GetUserRequest, UserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DbDaoFactory } from "../../model/dao/db/DbDaoFactory";

export const handler = async (event: GetUserRequest): Promise<UserResponse> => {
    const service = new UserService(new DbDaoFactory());
    const user = await service.getUser(event.authToken, event.alias);
    return { 
        success: true,
        message: "User found",
        user: user};
};