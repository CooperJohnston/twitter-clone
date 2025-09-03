import { TweeterResponse } from "./tweeterResponse";

export interface CountResponse extends TweeterResponse {
    count: number;
}