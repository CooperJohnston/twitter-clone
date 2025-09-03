import { UserDTO } from "../../dto/userDto";
import { TweeterResponse } from "./tweeterResponse";

export interface PagedUserItemResponse extends TweeterResponse {

    readonly items: UserDTO[] | null;
    readonly hasMore: boolean;
}