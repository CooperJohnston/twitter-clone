import { TweeterResponse } from "./tweeterResponse";
export interface StatusListResponse extends TweeterResponse {
    readonly statusList: string[];
    readonly hasMore: boolean;
}
