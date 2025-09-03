import { AuthResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DbDaoFactory } from "../../model/dao/db/DbDaoFactory";

export const handler = async (event: LoginRequest): Promise<AuthResponse> => {
    const service = new UserService(new DbDaoFactory());
    const [user, authToken] = await service.login(event.alias, event.password);
    return {
        success: true,
        message: "User logged in",
        user: user,
        authToken: authToken
    };

}