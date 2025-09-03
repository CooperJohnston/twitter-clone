import { UserDTO } from "../../dto/userDto";
import { TweeterResponse } from "./tweeterResponse";

export interface UserResponse extends TweeterResponse {
    readonly user: UserDTO | null;
}