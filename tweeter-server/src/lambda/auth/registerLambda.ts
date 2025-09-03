import { AuthResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DbDaoFactory } from "../../model/dao/db/DbDaoFactory";

export const handler = async (event: RegisterRequest): Promise<AuthResponse> => {
    const service = new UserService(new DbDaoFactory());
    const [user, authToken] = await service.register(event.firstName, event.lastName, event.alias, event.password, event.imageString, event.imageFileExtension);
    return {
        success: true,
        message: "User registered",
        user: user,
        authToken: authToken
    };
};