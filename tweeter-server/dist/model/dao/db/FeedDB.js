"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedDB = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const DataPage_1 = require("../interfaces/DataPage");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const FollowsDB_1 = require("./FollowsDB");
const client_sqs_1 = require("@aws-sdk/client-sqs");
const client_sqs_2 = require("@aws-sdk/client-sqs");
class FeedDB {
    tableName = "feeds";
    follower_alias = "user_alias";
    post_content = "post_content";
    time_stamp = "time_stamp";
    client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    async loadMoreFeedItems(alias, pageSize, lastItem) {
        const params = {
            KeyConditionExpression: `${this.follower_alias} = :fol`,
            ExpressionAttributeValues: {
                ":fol": { S: alias }, // Wrap the string in the AttributeValue structure
            },
            TableName: this.tableName,
            Limit: pageSize,
            ScanIndexForward: false,
            ExclusiveStartKey: lastItem === undefined
                ? undefined
                : {
                    [this.follower_alias]: { S: alias }, // Wrap the string in the AttributeValue structure
                    [this.time_stamp]: { N: lastItem.toString() }, // Wrap the number in the AttributeValue structure
                },
        };
        try {
            const items = [];
            const data = await this.client.send(new client_dynamodb_1.QueryCommand(params));
            const hasMorePages = data.LastEvaluatedKey !== undefined;
            data.Items?.forEach((item) => {
                const status = tweeter_shared_1.Status.fromJson(item[this.post_content]?.S); // Use the `S` property for strings
                if (status) {
                    items.push(status);
                }
            });
            return new DataPage_1.DataPage(items, hasMorePages);
        }
        catch (e) {
            throw new Error("Error loading feed items: " + e);
        }
    }
    async batchUpload(command) {
        try {
            await this.client.send(new lib_dynamodb_1.BatchWriteCommand(command));
        }
        catch (e) {
            throw new Error("There was an error completing the batch write: " + e);
        }
    }
    async sendAToUserFeeds(newStatus) {
        let loop = true;
        let lastFollow = undefined;
        let sqsClient = new client_sqs_2.SQSClient();
        while (loop) {
            let response = await new FollowsDB_1.FollowsDB().getPageOfFollowers(newStatus.user.alias, 200, lastFollow !== undefined ? lastFollow.alias : undefined);
            let items = [];
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
                        await sqsClient.send(new client_sqs_1.SendMessageCommand({
                            DelaySeconds: 0,
                            MessageBody: JSON.stringify({
                                RequestItems: {
                                    [this.tableName]: items
                                }
                            }),
                            QueueUrl: "https://sqs.us-west-2.amazonaws.com/767398142149/FeedUpdateQueue",
                        }));
                        console.log("Sent full batch!");
                    }
                    catch (e) {
                        throw new Error("[Server Error] Error adding post to Statuses Queue: " + e);
                    }
                    items = [];
                }
            }
            if (items.length > 0) {
                // Send batch request to Update Feed Queue
                try {
                    await sqsClient.send(new client_sqs_1.SendMessageCommand({
                        DelaySeconds: 0,
                        MessageBody: JSON.stringify({
                            RequestItems: {
                                [this.tableName]: items
                            }
                        }),
                        QueueUrl: "https://sqs.us-west-2.amazonaws.com/767398142149/FeedUpdateQueue",
                    }));
                    console.log("Sent partial batch!");
                }
                catch (e) {
                    throw new Error("[Server Error] Error adding post to Statuses Queue: " + e);
                }
                items = [];
            }
            loop = response.hasMore;
            lastFollow = response.values.pop();
        }
    }
}
exports.FeedDB = FeedDB;
