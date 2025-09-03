import { LoadStatusRequest, StatusListResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DbDaoFactory } from "../../model/dao/db/DbDaoFactory";

export const handler = async (request: LoadStatusRequest): Promise<StatusListResponse> => {

    const service = new StatusService(new DbDaoFactory());

    const [statusList, hasMore] = await service.loadMoreStoryItems(request.token, request.alias, request.pageSize, request.lastItem);

    return {
        success: true,
        message: "Success",
        statusList: statusList,
        hasMore: hasMore
    }
}