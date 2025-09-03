import { PagedUserItemRequest, PagedUserItemResponse } from 'tweeter-shared';
import { FollowService } from '../../model/service/FollowService';
import { DbDaoFactory } from '../../model/dao/db/DbDaoFactory';


export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
    const service = new FollowService(new DbDaoFactory());
    const [items, hasMore] = await service.loadMoreFollowers(request.token, request.alias, request.pageSize, request.lastItem);

    return {
        success: true,
        message: "Success",
        items: items,
        hasMore: hasMore
    }

}