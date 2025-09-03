import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

export class FillFollowTableDao {
  //
  // Modify these values as needed to match your follow table.
  //
  private readonly tableName = "follows_v2";
  private follower_handle = "follower_handle";
  private follower_name = "follower_name";
  private follower_imageUrl = "follower_imageUrl";

  private followee_handle = "followee_handle";
  private followee_name = "followee_name";
  private followee_imageUrl = "followee_imageUrl";

  private imageUrl = "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";
  

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async createFollows(followeeAlias: string, followerAliasList: string[]) {
    if (followerAliasList.length == 0) {
      console.log("Zero followers to batch write");
      return;
    } else {
      const params = {
        RequestItems: {
          [this.tableName]: this.createPutFollowRequestItems(
            followeeAlias,
            followerAliasList
          ),
        },
      };

      try {
        const response = await this.client.send(new BatchWriteCommand(params));
        await this.putUnprocessedItems(response, params);
      } catch (err) {
        throw new Error(
          `Error while batch writing follows with params: ${params} \n${err}`
        );
      }
    }
  }

  private createPutFollowRequestItems(
    followeeAlias: string,
    followerAliasList: string[]
  ) {
    return followerAliasList.map((followerAlias) =>
      this.createPutFollowRequest(followerAlias, followeeAlias)
    );
  }

  private createPutFollowRequest(followerAlias: string, followeeAlias: string) {
    let item = {
      [this.follower_handle]: followerAlias,
      [this.followee_handle]: followeeAlias,

      [this.follower_name]: "first last",
      [this.followee_name]: "first last",

      [this.follower_imageUrl]: this.imageUrl,
      [this.followee_imageUrl]: this.imageUrl,
    }

    return {
      PutRequest: {
        Item: item,
      },
    };
  }

  private async putUnprocessedItems(
    resp: BatchWriteCommandOutput,
    params: BatchWriteCommandInput,
  ) {
    let delay = 10;
    let attempts = 0;

    while (
      resp.UnprocessedItems !== undefined &&
      Object.keys(resp.UnprocessedItems).length > 0
    ) {
      attempts++;

      if (attempts > 1) {
        // Pause before the next attempt
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Increase pause time for next attempt
        if (delay < 1000) {
          delay += 100;
        }
      }

      console.log(
        `Attempt ${attempts}. Processing ${
          Object.keys(resp.UnprocessedItems).length
        } unprocessed follow items.`
      );

      params.RequestItems = resp.UnprocessedItems;
      resp = await this.client.send(new BatchWriteCommand(params));
    }
  }
}