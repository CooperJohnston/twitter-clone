import { UserDTO } from "../../dto/userDto";
import { TweeterResponse } from "./tweeterResponse";

export interface AuthResponse extends TweeterResponse {
    readonly user: UserDTO;
    readonly authToken: string};