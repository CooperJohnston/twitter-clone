import { UserDTO } from "../dto/userDto";
export declare class User {
    private _firstName;
    private _lastName;
    private _alias;
    private _imageUrl;
    private _password;
    constructor(firstName: string, lastName: string, alias: string, imageUrl: string, password?: string | null);
    get firstName(): string;
    set firstName(value: string);
    get lastName(): string;
    set lastName(value: string);
    get name(): string;
    get alias(): string;
    set alias(value: string);
    get imageUrl(): string;
    set imageUrl(value: string);
    set password(value: string | null);
    get password(): string | null;
    equals(other: User): boolean;
    static fromJson(json: string | null | undefined): User | null;
    toJson(): string;
    get dto(): UserDTO;
    static fromDto(dto: UserDTO | null): User | null;
}
