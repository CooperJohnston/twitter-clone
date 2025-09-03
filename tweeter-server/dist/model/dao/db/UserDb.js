"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDB = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const tweeter_shared_1 = require("tweeter-shared");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserDB {
    tableName = "Users";
    alias = "alias";
    first_name = "first_name";
    last_name = "last_name";
    image_url = "image_url";
    password = "password";
    client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    async createUser(user) {
        try {
            const hashedPassword = bcryptjs_1.default.hashSync(user.password, 10); // Sync version
            const params = {
                TableName: this.tableName,
                Item: {
                    [this.alias]: user.alias,
                    [this.first_name]: user.firstName,
                    [this.last_name]: user.lastName,
                    [this.image_url]: user.imageUrl,
                    [this.password]: hashedPassword, // Store hashed password
                },
            };
            await this.client.send(new lib_dynamodb_1.PutCommand(params));
            return true;
        }
        catch (e) {
            throw new Error("[Server Error] There was an error registering a new user: " + e);
        }
    }
    async loginUser(alias, password) {
        const params = {
            TableName: this.tableName,
            Key: { [this.alias]: alias },
        };
        try {
            const output = await this.client.send(new lib_dynamodb_1.GetCommand(params));
            if (!output.Item) {
                return null;
            }
            const storedHashedPassword = output.Item[this.password];
            const passwordMatch = bcryptjs_1.default.compareSync(password, storedHashedPassword);
            if (!passwordMatch) {
                return null;
            }
            return new tweeter_shared_1.User(output.Item[this.first_name], output.Item[this.last_name], output.Item[this.alias], output.Item[this.image_url]);
        }
        catch (e) {
            throw new Error("Login error: " + e);
        }
    }
    async getUser(alias) {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.alias]: alias
            }
        };
        try {
            const output = await this.client.send(new lib_dynamodb_1.GetCommand(params));
            if (!output.Item) {
                return null;
            }
            else {
                return new tweeter_shared_1.User(output.Item[this.first_name], output.Item[this.last_name], output.Item[this.alias], output.Item[this.image_url]);
            }
        }
        catch (e) {
            throw new Error("error finding user : " + e);
        }
    }
}
exports.UserDB = UserDB;
