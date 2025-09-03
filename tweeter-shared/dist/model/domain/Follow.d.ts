import { User } from "./User";
export declare class Follow {
    private _follower;
    private _followee;
    constructor(follower: User, followee: User);
    get follower(): User;
    set follower(value: User);
    get followee(): User;
    set followee(value: User);
    static fromJson(json: string | null | undefined): Follow | null;
}
