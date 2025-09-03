import { Status, User } from "tweeter-shared";
import { DataPage } from "../interfaces/DataPage";
import { StatusesDAO } from "../interfaces/StatusDAO";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand,  QueryCommand } from "@aws-sdk/lib-dynamodb";

export class StatusDB implements StatusesDAO {
  readonly tableName = "statuses";
  readonly user_alias = "user_alias";
  readonly post_content = "post_content";
  readonly time_stamp = "time_stamp";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async getStatuses(
    alias: string,
    pageSize: number,
    lastItemTimeStamp: number | undefined
  ): Promise<DataPage<Status>> {
    
      const params = {
        TableName: "statuses",
        KeyConditionExpression: "#user_alias = :alias",

        ExpressionAttributeNames: {
          "#user_alias": "user_alias"
        },
        ExpressionAttributeValues: {
          ":alias": alias
        },
        Limit: pageSize,
        ScanIndexForward: false,  // Newest first
        ExclusiveStartKey: lastItemTimeStamp ? {
          user_alias: alias ,
          time_stamp: lastItemTimeStamp
        } : undefined
      };
  
    

    try {
      const userStatuses: Status[] = [];
      const data = await this.client.send(new QueryCommand(params));
      const hasMorePages = data.LastEvaluatedKey !== undefined;
      data.Items?.forEach((item) => {try {
        let status = Status.fromJson(item[this.post_content]);
        if (!!status) {
          userStatuses.push(status);
        }} catch (e){}
      }
    );
    
      
      return new DataPage<Status>(userStatuses, hasMorePages);
    } catch (e) {
      throw new Error(`[Server Error]: this is the param we tried ${JSON.stringify(params)}` + e);
    }
  }

  async postStatus(newStatus: Status): Promise<boolean> {
    let params = {
      TableName: this.tableName,
      Item: {
        [this.user_alias]: newStatus.user.alias,
        [this.time_stamp]: newStatus.timestamp,
        [this.post_content]: newStatus.toJson(), 
        user_last_name:  newStatus.user.lastName ,
          user_first_name:  newStatus.user.firstName ,
            post_text:  newStatus.post ,
            user_image_url:  newStatus.user.imageUrl ,
      }
    };
  
    try {
      await this.client.send(new PutCommand(params));
      return true;
    } catch (e) {
      console.error("Error saving status:", params, e);
      throw new Error("Failed to save status: " + e);
    }
  }
}