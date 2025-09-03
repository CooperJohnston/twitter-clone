import { Status } from "tweeter-shared";
import { DataPage } from "./DataPage";

export abstract class StatusesDAO {
    abstract getStatuses(
      alias: string,
      pageSize: number,
      lastItemTimeStamp: number | undefined
    ): Promise<DataPage<Status>>;
  
    abstract postStatus(
      newStatus: Status,
    ): Promise<boolean>;
  }