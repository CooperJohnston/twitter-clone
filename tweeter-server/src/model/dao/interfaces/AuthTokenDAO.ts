import { AuthToken } from "tweeter-shared";


export abstract class AuthTokenDAO {
  abstract createAuthToken(authToken: AuthToken, alias: String): Promise<AuthToken>;

  abstract checkAuthToken(token: string): Promise<Boolean>;
  
  abstract deleteAuthToken(token: string): Promise<Boolean>;
}