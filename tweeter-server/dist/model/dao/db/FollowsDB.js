"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowsDB = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const tweeter_shared_1 = require("tweeter-shared");
const DataPage_1 = require("../interfaces/DataPage");
class FollowsDB {
    tableName = "follows_v2";
    indexName = "follower_index";
    followee_handle_index = "followee_handle_index";
    follower_handle = "follower_handle";
    follower_name = "follower_name";
    follower_imageUrl = "follower_imageUrl";
    followee_handle = "followee_handle";
    followee_name = "followee_name";
    followee_imageUrl = "followee_imageUrl";
    client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    async addFollow(follow) {
        // Validate input
        if (!follow?.follower?.alias || !follow?.followee?.alias) {
            throw new Error("[Bad Request] Follower and followee aliases are required");
        }
        console.log("Attempting to create follow relationship:", {
            follower: follow.follower.alias,
            followee: follow.followee.alias,
            followerName: follow.follower.name,
            followeeName: follow.followee.name
        });
        const params = {
            TableName: this.tableName,
            Item: {
                [this.follower_handle]: follow.follower.alias,
                [this.followee_handle]: follow.followee.alias,
                [this.follower_name]: follow.follower.name,
                [this.followee_name]: follow.followee.name,
                [this.follower_imageUrl]: follow.follower.imageUrl,
                [this.followee_imageUrl]: follow.followee.imageUrl,
            },
        };
        try {
            console.log("PutCommand params:", JSON.stringify(params, null, 2));
            await this.client.send(new lib_dynamodb_1.PutCommand(params));
            console.log(`Successfully created follow relationship: ${follow.follower.alias} → ${follow.followee.alias}`);
        }
        catch (e) {
            console.error("Failed to create follow relationship:", {
                follower: follow.follower.alias,
                followee: follow.followee.alias,
                error: e
            });
            throw new Error(`[Server Error] Failed to create follow relationship between ${follow.follower.alias} and ${follow.followee.alias}: ${JSON.stringify(e)}`);
        }
    }
    async removeFollow(follow) {
        // Validate input
        if (!follow?.follower?.alias || !follow?.followee?.alias) {
            throw new Error("[Bad Request] Both follower and followee aliases are required");
        }
        console.log(`Attempting to remove follow relationship: ${follow.follower.alias} → ${follow.followee.alias}`);
        const params = {
            TableName: this.tableName,
            Key: {
                [this.follower_handle]: follow.follower.alias,
                [this.followee_handle]: follow.followee.alias
            },
            ReturnValues: "ALL_OLD" // Returns the deleted item for verification
        };
        try {
            console.log("DeleteCommand params:", JSON.stringify(params, null, 2));
            const result = await this.client.send(new lib_dynamodb_1.DeleteCommand(params));
            if (!result.Attributes) {
                console.warn(`No follow relationship found between ${follow.follower.alias} and ${follow.followee.alias}`);
                // Depending on your requirements, you might want to throw an error here
            }
            else {
                console.log(`Successfully removed follow relationship: ${follow.follower.alias} → ${follow.followee.alias}`);
            }
        }
        catch (e) {
            console.error("Failed to remove follow relationship:", {
                follower: follow.follower.alias,
                followee: follow.followee.alias,
                error: e
            });
            throw new Error(`[Server Error] Failed to remove follow relationship between ${follow.follower.alias} and ${follow.followee.alias}: ${e}`);
        }
    }
    createFollow(follow) {
        return {
            [this.follower_handle]: follow.follower.alias,
            [this.followee_handle]: follow.followee.alias,
        };
    }
    async getFollow(follow) {
        const params = {
            TableName: this.tableName,
            Key: this.createFollow(follow),
        };
        try {
            const output = await this.client.send(new lib_dynamodb_1.GetCommand(params));
            return output.Item == undefined
                ? undefined
                : new tweeter_shared_1.Follow(new tweeter_shared_1.User(output.Item[this.follower_name].split(" ", 2)[0], output.Item[this.follower_name].split(" ", 2)[1], output.Item[this.follower_handle], output.Item[this.follower_imageUrl]), new tweeter_shared_1.User(output.Item[this.followee_name].split(" ", 2)[0], output.Item[this.followee_name].split(" ", 2)[1], output.Item[this.followee_handle], output.Item[this.followee_imageUrl]));
        }
        catch (e) {
            throw new Error("[Server Error] : " + e);
        }
    }
    async getNumFollowers(alias) {
        let moreToCount = true;
        let followerCount = 0;
        let lastKey = undefined;
        while (moreToCount) {
            const params = {
                TableName: this.tableName,
                Select: "COUNT",
                IndexName: this.followee_handle_index,
                KeyConditionExpression: `${this.followee_handle} = :fol`,
                ExpressionAttributeValues: {
                    ":fol": alias,
                },
                ExclusiveStartKey: lastKey
            };
            try {
                const data = await this.client.send(new lib_dynamodb_1.QueryCommand(params));
                followerCount += data.Count ?? 0;
                moreToCount = data.LastEvaluatedKey !== undefined;
                lastKey = data.LastEvaluatedKey;
            }
            catch (e) {
                throw new Error(`Failed to count followers: ${e instanceof Error ? e.message : String(e)}`);
            }
        }
        return followerCount;
    }
    async getNumFollowees(alias) {
        if (!alias || typeof alias !== 'string') {
            throw new Error('Invalid alias: must be a non-empty string');
        }
        const params = {
            TableName: this.tableName,
            Select: "COUNT",
            KeyConditionExpression: `${this.follower_handle} = :fol`,
            ExpressionAttributeValues: {
                ":fol": alias,
            },
        };
        try {
            const data = await this.client.send(new lib_dynamodb_1.QueryCommand(params));
            return data.Count ?? 0;
        }
        catch (e) {
            throw new Error(`Failed to count followees: ${e instanceof Error ? e.message : String(e)}`);
        }
    }
    async getPageOfFollowers(followeeHandle, pageSize, lastFollowerHandle) {
        const params = {
            KeyConditionExpression: this.followee_handle + " = :fol",
            ExpressionAttributeValues: {
                ":fol": followeeHandle,
            },
            TableName: this.tableName,
            IndexName: this.followee_handle_index,
            Limit: pageSize,
            ExclusiveStartKey: lastFollowerHandle === undefined
                ? undefined
                : {
                    [this.follower_handle]: lastFollowerHandle,
                    [this.followee_handle]: followeeHandle,
                },
        };
        try {
            const items = [];
            const data = await this.client.send(new lib_dynamodb_1.QueryCommand(params));
            const hasMorePages = data.LastEvaluatedKey !== undefined;
            data.Items?.forEach((item) => {
                try {
                    console.log(JSON.stringify(item)),
                        items.push(new tweeter_shared_1.User(item[this.follower_name].split(" ", 2)[0], item[this.follower_name].split(" ", 2)[1], item[this.follower_handle], item[this.follower_imageUrl]));
                }
                catch { }
            });
            return new DataPage_1.DataPage(items, hasMorePages);
        }
        catch (e) {
            throw new Error("[Server Error] : " + e);
        }
    }
    async getPageOfFollowees(followerHandle, pageSize, lastFolloweeHandle) {
        const params = {
            KeyConditionExpression: `${this.follower_handle} = :follower`,
            ExpressionAttributeValues: {
                ":follower": followerHandle,
            },
            TableName: this.tableName,
            Limit: pageSize,
            ExclusiveStartKey: lastFolloweeHandle === undefined
                ? undefined
                : {
                    [this.followee_handle]: lastFolloweeHandle,
                    [this.follower_handle]: followerHandle,
                },
        };
        try {
            const items = [];
            const data = await this.client.send(new lib_dynamodb_1.QueryCommand(params));
            const hasMorePages = data.LastEvaluatedKey !== undefined;
            data.Items?.forEach((item) => items.push(new tweeter_shared_1.User(item[this.followee_name].split(" ", 2)[0], item[this.followee_name].split(" ", 2)[1], item[this.followee_handle], item[this.followee_imageUrl])));
            return new DataPage_1.DataPage(items, hasMorePages);
        }
        catch (e) {
            throw new Error("[Server Error] : " + e);
        }
    }
}
exports.FollowsDB = FollowsDB;
