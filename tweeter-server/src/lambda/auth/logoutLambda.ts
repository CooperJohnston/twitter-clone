import { LogoutRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DbDaoFactory } from "../../model/dao/db/DbDaoFactory";

export const handler = async (event: LogoutRequest): Promise<void> => {
    const service = new UserService(new DbDaoFactory());
    await service.logout(event.token);

    return
};