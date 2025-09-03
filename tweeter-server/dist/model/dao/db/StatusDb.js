"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusDB = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const DataPage_1 = require("../interfaces/DataPage");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
class StatusDB {
    tableName = "statuses";
    user_alias = "user_alias";
    post_content = "post_content";
    time_stamp = "time_stamp";
    client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    async getStatuses(alias, pageSize, lastItemTimeStamp) {
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
            ScanIndexForward: false, // Newest first
            ExclusiveStartKey: lastItemTimeStamp ? {
                user_alias: alias,
                time_stamp: lastItemTimeStamp
            } : undefined
        };
        try {
            const userStatuses = [];
            const data = await this.client.send(new lib_dynamodb_1.QueryCommand(params));
            const hasMorePages = data.LastEvaluatedKey !== undefined;
            data.Items?.forEach((item) => {
                try {
                    let status = tweeter_shared_1.Status.fromJson(item[this.post_content]);
                    if (!!status) {
                        userStatuses.push(status);
                    }
                }
                catch (e) { }
            });
            return new DataPage_1.DataPage(userStatuses, hasMorePages);
        }
        catch (e) {
            throw new Error(`[Server Error]: this is the param we tried ${JSON.stringify(params)}` + e);
        }
    }
    async postStatus(newStatus) {
        let params = {
            TableName: this.tableName,
            Item: {
                [this.user_alias]: newStatus.user.alias,
                [this.time_stamp]: newStatus.timestamp,
                [this.post_content]: newStatus.toJson(),
                user_last_name: newStatus.user.lastName,
                user_first_name: newStatus.user.firstName,
                post_text: newStatus.post,
                user_image_url: newStatus.user.imageUrl,
            }
        };
        try {
            await this.client.send(new lib_dynamodb_1.PutCommand(params));
            return true;
        }
        catch (e) {
            console.error("Error saving status:", params, e);
            throw new Error("Failed to save status: " + e);
        }
    }
}
exports.StatusDB = StatusDB;
