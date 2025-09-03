import { AuthToken } from "tweeter-shared";
import { AuthTokenDAO } from "../interfaces/AuthTokenDAO";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class AuthTokenDB implements AuthTokenDAO{
    readonly tableName = 'auth_token_handler'
    readonly token_str = "token_str";
    readonly user_alias = "user_alias";
    readonly time_stamp = "time_stamp";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    readonly expirationTimeLimitMins = 15;


    async createAuthToken(authToken: AuthToken, alias: String): Promise<AuthToken> {
        const params = {
      TableName: this.tableName,
      Item: {
        [this.token_str]: authToken.token,
        [this.user_alias]: alias,
        [this.time_stamp]: authToken.timestamp
      },
    };
    try {
      await this.client.send(new PutCommand(params));
      return authToken;
    } catch (e) {
      throw new Error("Authtoken could not be added because: " + e);
    }
  
    }


    async checkAuthToken(token: string): Promise<Boolean> {
        const params = {
            TableName: this.tableName,
            Key: {
              [this.token_str]: token
            }
          };
      
          try {
            const output = await this.client.send(new GetCommand(params));
            if (output.Item === undefined || output.Item === null) {
              return false;
            } else {
              let authTokenAge =
                Math.abs(Date.now() - output.Item[this.time_stamp]) / 1000 / 60;
      
              return authTokenAge <= this.expirationTimeLimitMins;
            }
          } catch (e) {
            throw new Error("Failed to check authToken. Here's why : " + e)
          }
        }
    
    async deleteAuthToken(token: string): Promise<Boolean> {
        const params = {
            TableName: this.tableName,
            Key: {
              [this.token_str]: token
            }
          };
      
          try {
            await this.client.send(new DeleteCommand(params));
            return true;
          } catch (e) {
            throw new Error("Error deleting authToken because : " + e)
          }
    }

}