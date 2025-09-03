import { UserDTO } from "../../dto/userDto";
import { UserItemRequest } from "./userItemRequest";

export interface UserInspectionRequest extends UserItemRequest{
    readonly selectedUser: UserDTO;
}