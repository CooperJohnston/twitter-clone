import { tweeterRequest } from "./tweeterRequest";
export interface GetUserRequest extends tweeterRequest {
    authToken: string;
    alias: string;
}
