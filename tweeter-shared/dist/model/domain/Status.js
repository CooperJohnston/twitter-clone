"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
const PostSegment_1 = require("./PostSegment");
const User_1 = require("./User");
const date_fns_1 = require("date-fns");
class Status {
    _post;
    _user;
    _timestamp;
    _segments;
    constructor(post, user, timestamp) {
        this._post = post;
        this._user = user;
        this._timestamp = timestamp;
        this._segments = this.getPostSegments(post);
    }
    getPostSegments(post) {
        const segments = [];
        let startIndex = 0;
        for (let reference of Status.getSortedReferences(post)) {
            if (startIndex < reference.startPostion) {
                segments.push(new PostSegment_1.PostSegment(post.substring(startIndex, reference.startPostion), startIndex, reference.startPostion - 1, PostSegment_1.Type.text));
            }
            segments.push(reference);
            startIndex = reference.endPosition;
        }
        if (startIndex < post.length) {
            segments.push(new PostSegment_1.PostSegment(post.substring(startIndex), startIndex, post.length, PostSegment_1.Type.text));
        }
        return segments;
    }
    static getSortedReferences(post) {
        const references = [
            ...Status.parseUrlReferences(post),
            ...Status.parseMentionReferences(post),
            ...Status.parseNewlines(post),
        ];
        references.sort((a, b) => {
            return a.startPostion - b.startPostion;
        });
        return references;
    }
    static parseUrlReferences(post) {
        const references = [];
        const urls = Status.parseUrls(post);
        let previousStartIndex = 0;
        for (let url of urls) {
            let startIndex = post.indexOf(url, previousStartIndex);
            if (startIndex > -1) {
                // Push the url
                references.push(new PostSegment_1.PostSegment(url, startIndex, startIndex + url.length, PostSegment_1.Type.url));
                // Move start and previous start past the url
                startIndex = startIndex + url.length;
                previousStartIndex = startIndex;
            }
        }
        return references;
    }
    static parseUrls(post) {
        const urls = [];
        for (let word of post.split(/(\s+)/)) {
            if (word.startsWith("http://") || word.startsWith("https://")) {
                const endIndex = Status.findUrlEndIndex(word);
                urls.push(word.substring(0, endIndex));
            }
        }
        return urls;
    }
    static findUrlEndIndex(word) {
        let index;
        if (word.includes(".com")) {
            index = word.indexOf(".com");
            index += 4;
        }
        else if (word.includes(".net")) {
            index = word.indexOf(".net");
            index += 4;
        }
        else if (word.includes(".org")) {
            index = word.indexOf(".org");
            index += 4;
        }
        else if (word.includes(".edu")) {
            index = word.indexOf(".edu");
            index += 4;
        }
        else if (word.includes(".mil")) {
            index = word.indexOf(".mil");
            index += 4;
        }
        else {
            index = word.length;
            // Remove trailing non-alphabetic characters (such as punctuation) that can't be at the end of a url
            while (!Status.isLetter(word[index])) {
                index--;
            }
        }
        return index;
    }
    static isLetter(c) {
        return c.length === 1 && c.match(/[a-zA-Z]/g) != null;
    }
    static parseMentionReferences(post) {
        const references = [];
        const mentions = Status.parseMentions(post);
        let previousStartIndex = 0;
        for (let mention of mentions) {
            let startIndex = post.indexOf(mention, previousStartIndex);
            if (startIndex > -1) {
                // Push the alias
                references.push(new PostSegment_1.PostSegment(mention, startIndex, startIndex + mention.length, PostSegment_1.Type.alias));
                // Move start and previous start past the mention
                startIndex = startIndex + mention.length;
                previousStartIndex = startIndex;
            }
        }
        return references;
    }
    static parseMentions(post) {
        const mentions = [];
        for (let word of post.split(/(\s+)/)) {
            if (word.startsWith("@")) {
                // Remove all non-alphanumeric characters
                word.replaceAll(/[^a-zA-Z0-9]/g, "");
                mentions.push(word);
            }
        }
        return mentions;
    }
    static parseNewlines(post) {
        const newlines = [];
        const regex = /\n/g;
        let match;
        while ((match = regex.exec(post)) !== null) {
            const matchIndex = match.index;
            newlines.push(new PostSegment_1.PostSegment("\n", matchIndex, matchIndex + 1, PostSegment_1.Type.newline));
        }
        return newlines;
    }
    get post() {
        return this._post;
    }
    set post(value) {
        this._post = value;
    }
    get user() {
        return this._user;
    }
    set user(value) {
        this._user = value;
    }
    get timestamp() {
        return this._timestamp;
    }
    get formattedDate() {
        let date = new Date(this.timestamp);
        return (0, date_fns_1.format)(date, "MMMM dd, yyyy HH:mm:ss");
    }
    set timestamp(value) {
        this._timestamp = value;
    }
    get segments() {
        return this._segments;
    }
    set segments(value) {
        this._segments = value;
    }
    equals(other) {
        return (this._user.equals(other.user) &&
            this._timestamp === other._timestamp &&
            this._post === other.post);
    }
    static fromJson(json) {
        if (!!json) {
            const jsonObject = JSON.parse(json);
            return new Status(jsonObject._post, new User_1.User(jsonObject._user._firstName, jsonObject._user._lastName, jsonObject._user._alias, jsonObject._user._imageUrl), jsonObject._timestamp);
        }
        else {
            return null;
        }
    }
    toJson() {
        return JSON.stringify(this);
    }
}
exports.Status = Status;
