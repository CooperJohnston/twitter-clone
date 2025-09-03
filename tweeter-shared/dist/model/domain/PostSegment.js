"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostSegment = exports.Type = void 0;
var Type;
(function (Type) {
    Type["text"] = "Text";
    Type["alias"] = "Alias";
    Type["url"] = "URL";
    Type["newline"] = "Newline";
})(Type || (exports.Type = Type = {}));
class PostSegment {
    _text;
    _startPostion;
    _endPosition;
    _type;
    constructor(text, startPosition, endPosition, type) {
        this._text = text;
        this._startPostion = startPosition;
        this._endPosition = endPosition;
        this._type = type;
    }
    get text() {
        return this._text;
    }
    get startPostion() {
        return this._startPostion;
    }
    get endPosition() {
        return this._endPosition;
    }
    get type() {
        return this._type;
    }
}
exports.PostSegment = PostSegment;
