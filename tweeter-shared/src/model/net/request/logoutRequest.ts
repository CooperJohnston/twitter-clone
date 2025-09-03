import { tweeterRequest } from "./tweeterRequest";

export interface LogoutRequest extends tweeterRequest {
    readonly token: string;
}