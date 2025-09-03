import { tweeterRequest } from "./tweeterRequest";

export interface LoadStatusRequest extends tweeterRequest{
    readonly token: string;
    readonly alias: string;
    readonly pageSize: number;
    readonly lastItem: string | null;

}