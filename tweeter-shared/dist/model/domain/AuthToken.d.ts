export declare class AuthToken {
    private _token;
    private _timestamp;
    static Generate(): AuthToken;
    private static generateToken;
    constructor(token: string, timestamp: number);
    get token(): string;
    set token(value: string);
    get timestamp(): number;
    set timestamp(value: number);
    static fromJson(json: string | null | undefined): AuthToken | null;
    toJson(): string;
}
