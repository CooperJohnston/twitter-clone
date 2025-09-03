import { DbDaoFactory } from "../../model/dao/db/DbDaoFactory";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (event: any): Promise<void> => {
    for (let i = 0; i < event.Records.length; ++i) {
        const { body } = event.Records[i];
        await new StatusService(new DbDaoFactory()).batchUploadToFeeds(JSON.parse(body));
      }
}