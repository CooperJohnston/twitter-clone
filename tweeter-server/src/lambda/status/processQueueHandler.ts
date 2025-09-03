import { Status } from "tweeter-shared";
import { DbDaoFactory } from "../../model/dao/db/DbDaoFactory";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (event: any): Promise<void> => {
  console.log("Processing SQS event:", JSON.stringify(event, null, 2));

  const service = new StatusService(new DbDaoFactory());

  for (const record of event.Records) {
    const statusJson = record.body; // This is a string
    const status = Status.fromJson(statusJson); // Convert to Status object

    if (!status) {
      console.error("[Bad Request] Invalid status in queue message");
      continue;
    }

    try {
      await service.addToFeeds(status);
    } catch (e) {
      console.error("Failed to add status to feeds:", e);
    }
  }
};
