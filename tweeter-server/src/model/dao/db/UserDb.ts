import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { User } from "tweeter-shared";
import { UserDAO } from "../interfaces/UserDAO";
import bcrypt from "bcryptjs";

export class UserDB implements UserDAO {

  readonly tableName = "Users";
  readonly alias = "alias";
  readonly first_name = "first_name";
  readonly last_name = "last_name";
  readonly image_url = "image_url";
  readonly password = "password";
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async createUser(user: User): Promise<boolean> {
    try {
        const hashedPassword = bcrypt.hashSync(user.password!, 10); // Sync version

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

        await this.client.send(new PutCommand(params));
        return true;
    } catch (e) {
        throw new Error("[Server Error] There was an error registering a new user: " + e);
    }
}
  


async loginUser(alias: string, password: string): Promise<User | null> {
  const params = {
      TableName: this.tableName,
      Key: { [this.alias]: alias },
  };

  try {
      const output = await this.client.send(new GetCommand(params));

      if (!output.Item) {
          return null;
      }

      const storedHashedPassword = output.Item[this.password];

      const passwordMatch = bcrypt.compareSync(password, storedHashedPassword);
      if (!passwordMatch) {
          return null;
      }

      return new User(
          output.Item[this.first_name],
          output.Item[this.last_name],
          output.Item[this.alias],
          output.Item[this.image_url]
      );
  } catch (e) {
      throw new Error("Login error: " + e);
  }
}

  
    async getUser(alias: string): Promise<User | null> {
      const params = {
        TableName: this.tableName,
        Key: {
          [this.alias]: alias
        }
      };
  
      try {
        const output = await this.client.send(new GetCommand(params));
  
        if (!output.Item) {
          return null;
      
        } else {
          return new User(
            output.Item[this.first_name],
            output.Item[this.last_name],
            output.Item[this.alias],
            output.Item[this.image_url]);
        }
      } catch (e) {
        throw new Error("error finding user : " + e)
      }
    }
  
  }