"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FillUserTableDao = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const bcrypt = __importStar(require("bcryptjs"));
class FillUserTableDao {
    //
    // Modify these values as needed to match your user table.
    //
    tableName = "Users";
    userAliasAttribute = "alias";
    userFirstNameAttribute = "first_name";
    userLastNameAttribute = "last_name";
    userImageUrlAttribute = "image_url";
    passwordHashAttribute = "password";
    client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    async createUsers(userList, password) {
        if (userList.length == 0) {
            console.log("zero followers to batch write");
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const params = {
            RequestItems: {
                [this.tableName]: this.createPutUserRequestItems(userList, hashedPassword),
            },
        };
        try {
            const resp = await this.client.send(new lib_dynamodb_1.BatchWriteCommand(params));
            await this.putUnprocessedItems(resp, params);
        }
        catch (err) {
            throw new Error(`Error while batch writing users with params: ${params}: \n${err}`);
        }
    }
    createPutUserRequestItems(userList, hashedPassword) {
        return userList.map((user) => this.createPutUserRequest(user, hashedPassword));
    }
    createPutUserRequest(user, hashedPassword) {
        const item = {
            [this.userAliasAttribute]: user.alias,
            [this.userFirstNameAttribute]: user.firstName,
            [this.userLastNameAttribute]: user.lastName,
            [this.passwordHashAttribute]: hashedPassword,
            [this.userImageUrlAttribute]: user.imageUrl,
        };
        return {
            PutRequest: {
                Item: item,
            },
        };
    }
    async putUnprocessedItems(resp, params) {
        let delay = 10;
        let attempts = 0;
        while (resp.UnprocessedItems !== undefined &&
            Object.keys(resp.UnprocessedItems).length > 0) {
            attempts++;
            if (attempts > 1) {
                // Pause before the next attempt
                await new Promise((resolve) => setTimeout(resolve, delay));
                // Increase pause time for next attempt
                if (delay < 1000) {
                    delay += 100;
                }
            }
            console.log(`Attempt ${attempts}. Processing ${Object.keys(resp.UnprocessedItems).length} unprocessed users.`);
            params.RequestItems = resp.UnprocessedItems;
            resp = await this.client.send(new lib_dynamodb_1.BatchWriteCommand(params));
        }
    }
}
exports.FillUserTableDao = FillUserTableDao;
