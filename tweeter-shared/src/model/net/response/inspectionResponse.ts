import { TweeterResponse } from "./tweeterResponse";

export interface InspectionResponse extends TweeterResponse {
    isFollower: boolean;
}