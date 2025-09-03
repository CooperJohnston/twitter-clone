import { StatusRequest } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DbDaoFactory } from "../../model/dao/db/DbDaoFactory";

export const handler = async (request: StatusRequest): Promise<void> => {
    const service = new StatusService(new DbDaoFactory());
    await service.postStatus(request.token, request.status);
    return;
}