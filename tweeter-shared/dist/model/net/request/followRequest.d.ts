import { tweeterRequest } from "../request/tweeterRequest";
import { Follow } from "../../domain/Follow";
export interface FollowRequest extends tweeterRequest {
    readonly follow: Follow;
}
