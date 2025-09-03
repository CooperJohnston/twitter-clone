"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTokenDB = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
class AuthTokenDB {
    tableName = 'auth_token_handler';
    token_str = "token_str";
    user_alias = "user_alias";
    time_stamp = "time_stamp";
    client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    expirationTimeLimitMins = 15;
    async createAuthToken(authToken, alias) {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.token_str]: authToken.token,
                [this.user_alias]: alias,
                [this.time_stamp]: authToken.timestamp
            },
        };
        try {
            await this.client.send(new lib_dynamodb_1.PutCommand(params));
            return authToken;
        }
        catch (e) {
            throw new Error("Authtoken could not be added because: " + e);
        }
    }
    async checkAuthToken(token) {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.token_str]: token
            }
        };
        try {
            const output = await this.client.send(new lib_dynamodb_1.GetCommand(params));
            if (output.Item === undefined || output.Item === null) {
                return false;
            }
            else {
                let authTokenAge = Math.abs(Date.now() - output.Item[this.time_stamp]) / 1000 / 60;
                return authTokenAge <= this.expirationTimeLimitMins;
            }
        }
        catch (e) {
            throw new Error("Failed to check authToken. Here's why : " + e);
        }
    }
    async deleteAuthToken(token) {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.token_str]: token
            }
        };
        try {
            await this.client.send(new lib_dynamodb_1.DeleteCommand(params));
            return true;
        }
        catch (e) {
            throw new Error("Error deleting authToken because : " + e);
        }
    }
}
exports.AuthTokenDB = AuthTokenDB;
