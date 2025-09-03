import { Status, User } from "tweeter-shared";
import { DataPage } from "../interfaces/DataPage";
import { FeedsDAO } from "../interfaces/FeedDAO";
import { DynamoDBClient, QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { BatchWriteCommand, DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";
import { FollowsDB } from "./FollowsDB";
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { SQSClient } from "@aws-sdk/client-sqs";

export class FeedDB implements FeedsDAO{
  
  readonly tableName = "feeds";
  readonly follower_alias = "user_alias";
  readonly post_content = "post_content";
  readonly time_stamp = "time_stamp";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());



  async loadMoreFeedItems(alias: string, pageSize: number, lastItem: number | undefined): Promise<DataPage<Status>> {
    const params: QueryCommandInput = {
      KeyConditionExpression: `${this.follower_alias} = :fol`,
      ExpressionAttributeValues: {
        ":fol": { S: alias }, // Wrap the string in the AttributeValue structure
      },
      TableName: this.tableName,
      Limit: pageSize,
      ScanIndexForward: false,
      ExclusiveStartKey:
        lastItem === undefined
          ? undefined
          : {
              [this.follower_alias]: { S: alias }, // Wrap the string in the AttributeValue structure
              [this.time_stamp]: { N: lastItem.toString() }, // Wrap the number in the AttributeValue structure
            },
    };
  
    try {
      const items: Status[] = [];
      const data = await this.client.send(new QueryCommand(params));
      const hasMorePages = data.LastEvaluatedKey !== undefined;
      data.Items?.forEach((item) => {
        const status = Status.fromJson(item[this.post_content]?.S); // Use the `S` property for strings
        if (status) {
          items.push(status);
        }
      });
  
      return new DataPage<Status>(items, hasMorePages);
    } catch (e) {
      throw new Error("Error loading feed items: " + e);
    }
  }

  async batchUpload(command: any): Promise<void> {
    try {
      await this.client.send(new BatchWriteCommand(command));
    } catch (e) {
      throw new Error("There was an error completing the batch write: " + e);
    }
  }
    
  async sendAToUserFeeds(newStatus: Status): Promise<void> {
    let loop = true;
    let lastFollow: User | undefined = undefined;
    let sqsClient = new SQSClient();


    while (loop) {
      let response:  DataPage<User> = await new FollowsDB().getPageOfFollowers(
        newStatus.user.alias, 200, lastFollow !== undefined ? lastFollow.alias : undefined);

      let items: any[] = [];

      for (const user of response.values) {
        items.push({
          PutRequest: {
            Item: {
              [this.follower_alias]: user.alias,
              [this.time_stamp]: newStatus.timestamp,
              [this.post_content]: JSON.stringify(newStatus)
            }
          }
        });

        // items is at batch size and needs to be sent to queue
        if (items.length === 25) {
          // Send batch request to Update Feed Queue
          try {
            await sqsClient.send(new SendMessageCommand({
              DelaySeconds: 0,
              MessageBody: JSON.stringify({
                RequestItems: {
                  [this.tableName]: items
                }
              }),
              QueueUrl: "https://sqs.us-west-2.amazonaws.com/767398142149/FeedUpdateQueue",
            }));
            console.log("Sent full batch!");
          } catch (e) {
            throw new Error("[Server Error] Error adding post to Statuses Queue: " + e);
          }
          items = [];
        }
      }


      if (items.length > 0) {
        // Send batch request to Update Feed Queue
        try {
          await sqsClient.send(new SendMessageCommand({
            DelaySeconds: 0,
            MessageBody: JSON.stringify({
              RequestItems: {
                [this.tableName]: items
              }
            }),
            QueueUrl: "https://sqs.us-west-2.amazonaws.com/767398142149/FeedUpdateQueue",
          }));
          console.log("Sent partial batch!");
        } catch (e) {
          throw new Error("[Server Error] Error adding post to Statuses Queue: " + e);
        }
        items = [];
      }

      loop = response.hasMore;
      lastFollow = response.values.pop();
    }

}
}