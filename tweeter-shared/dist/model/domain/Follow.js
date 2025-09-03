"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Follow = void 0;
const User_1 = require("./User");
class Follow {
    _follower;
    _followee;
    constructor(follower, followee) {
        this._follower = follower;
        this._followee = followee;
    }
    get follower() {
        return this._follower;
    }
    set follower(value) {
        this._follower = value;
    }
    get followee() {
        return this._followee;
    }
    set followee(value) {
        this._followee = value;
    }
    static fromJson(json) {
        if (!!json) {
            let jsonObject = JSON.parse(json);
            return new Follow(new User_1.User(jsonObject._follower._firstName, jsonObject._follower._lastName, jsonObject._follower._alias, jsonObject._follower._imageUrl), new User_1.User(jsonObject._followee._firstName, jsonObject._followee._lastName, jsonObject._followee._alias, jsonObject._followee._imageUrl));
        }
        else {
            return null;
        }
    }
}
exports.Follow = Follow;
