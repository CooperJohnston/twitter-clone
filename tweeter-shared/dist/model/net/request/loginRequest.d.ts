import { tweeterRequest } from "./tweeterRequest";
export interface LoginRequest extends tweeterRequest {
    alias: string;
    password: string;
}
