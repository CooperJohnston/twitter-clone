import { tweeterRequest } from "../request/tweeterRequest"
import { User } from "../../domain/User";

export interface GetFollowRequest extends tweeterRequest{
    readonly user: User
    readonly selectedUser: User
}