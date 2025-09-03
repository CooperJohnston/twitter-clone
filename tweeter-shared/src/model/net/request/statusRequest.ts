import { tweeterRequest } from "./tweeterRequest";


export interface StatusRequest extends tweeterRequest{
    readonly token: string;
    readonly status: string;
}