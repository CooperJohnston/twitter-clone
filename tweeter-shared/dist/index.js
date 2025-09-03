"use strict";
//
// domain classes
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeData = exports.AuthToken = exports.User = exports.Status = exports.Type = exports.PostSegment = exports.Follow = void 0;
//
var Follow_1 = require("./model/domain/Follow");
Object.defineProperty(exports, "Follow", { enumerable: true, get: function () { return Follow_1.Follow; } });
var PostSegment_1 = require("./model/domain/PostSegment");
Object.defineProperty(exports, "PostSegment", { enumerable: true, get: function () { return PostSegment_1.PostSegment; } });
Object.defineProperty(exports, "Type", { enumerable: true, get: function () { return PostSegment_1.Type; } });
var Status_1 = require("./model/domain/Status");
Object.defineProperty(exports, "Status", { enumerable: true, get: function () { return Status_1.Status; } });
var User_1 = require("./model/domain/User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
var AuthToken_1 = require("./model/domain/AuthToken");
Object.defineProperty(exports, "AuthToken", { enumerable: true, get: function () { return AuthToken_1.AuthToken; } });
// All classes that should be avaialble to other modules need to exported here. export * does not work when 
// uploading to lambda. Instead we have to list each export.
// other classes
var FakeData_1 = require("./util/FakeData");
Object.defineProperty(exports, "FakeData", { enumerable: true, get: function () { return FakeData_1.FakeData; } });
