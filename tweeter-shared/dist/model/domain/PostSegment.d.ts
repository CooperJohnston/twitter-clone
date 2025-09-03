export declare enum Type {
    text = "Text",
    alias = "Alias",
    url = "URL",
    newline = "Newline"
}
export declare class PostSegment {
    private _text;
    private _startPostion;
    private _endPosition;
    private _type;
    constructor(text: string, startPosition: number, endPosition: number, type: Type);
    get text(): string;
    get startPostion(): number;
    get endPosition(): number;
    get type(): Type;
}
