"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    _firstName;
    _lastName;
    _alias;
    _imageUrl;
    _password;
    constructor(firstName, lastName, alias, imageUrl, password = null) {
        this._firstName = firstName;
        this._lastName = lastName;
        this._alias = alias;
        this._imageUrl = imageUrl;
        this._password = password;
    }
    get firstName() {
        return this._firstName;
    }
    set firstName(value) {
        this._firstName = value;
    }
    get lastName() {
        return this._lastName;
    }
    set lastName(value) {
        this._lastName = value;
    }
    get name() {
        return `${this.firstName} ${this.lastName}`;
    }
    get alias() {
        return this._alias;
    }
    set alias(value) {
        this._alias = value;
    }
    get imageUrl() {
        return this._imageUrl;
    }
    set imageUrl(value) {
        this._imageUrl = value;
    }
    set password(value) {
        this._password = value;
    }
    get password() {
        return this._password;
    }
    equals(other) {
        return this._alias === other._alias;
    }
    static fromJson(json) {
        if (!!json) {
            const jsonObject = JSON.parse(json);
            return new User(jsonObject._firstName, jsonObject._lastName, jsonObject._alias, jsonObject._imageUrl, jsonObject._password);
        }
        else {
            return null;
        }
    }
    toJson() {
        return JSON.stringify(this);
    }
    get dto() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            alias: this.alias,
            imageUrl: this.imageUrl,
            password: this.password
        };
    }
    static fromDto(dto) {
        return dto == null ? null : new User(dto.firstName, dto.lastName, dto.alias, dto.imageUrl, dto.password);
    }
}
exports.User = User;
