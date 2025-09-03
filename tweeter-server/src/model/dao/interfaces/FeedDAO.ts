import {Status} from "tweeter-shared";
import { DataPage } from "./DataPage";


export abstract class FeedsDAO {
  abstract loadMoreFeedItems(
    alias: string,
    pageSize: number,
    lastItem: number | undefined
  ): Promise<DataPage<Status>>;

  abstract sendAToUserFeeds(newStatus: Status): Promise<void>;

  abstract batchUpload(items: any): Promise<void>;
}