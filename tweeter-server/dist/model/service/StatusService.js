"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const client_sqs_1 = require("@aws-sdk/client-sqs");
class StatusService {
    statusDAO;
    authDAO;
    feedDAO;
    constructor(daoFactory) {
        this.statusDAO = daoFactory.getStatusDAO();
        this.authDAO = daoFactory.getAuthTokenDAO();
        this.feedDAO = daoFactory.getFeedDAO();
    }
    async loadMoreFeedItems(authToken, userAlias, pageSize, lastItem) {
        // TODO: Replace with the result of calling server
        let auth = await this.authDAO.checkAuthToken(authToken);
        if (!auth) {
            throw new Error("Invalid auth token");
        }
        const dataPage = await this.feedDAO.loadMoreFeedItems(userAlias, pageSize, tweeter_shared_1.Status.fromJson(lastItem)?.timestamp ?? undefined);
        return this.makeStatusList(dataPage);
    }
    ;
    makeStatusList(page) {
        const statusItems = page.values;
        const hasMore = page.hasMore;
        const statusIds = statusItems.map((status) => status.toJson());
        return [statusIds, hasMore];
    }
    async loadMoreStoryItems(authToken, userAlias, pageSize, lastItem) {
        let auth = await this.authDAO.checkAuthToken(authToken);
        if (!auth) {
            throw new Error("Invalid auth token");
        }
        let lastTimeStamp = undefined;
        if (lastItem !== null) {
            let lastStatus = tweeter_shared_1.Status.fromJson(lastItem);
            if (lastStatus?.timestamp) {
                lastTimeStamp = lastStatus.timestamp;
            }
        }
        const dataPage = await this.statusDAO.getStatuses(userAlias, pageSize, lastTimeStamp);
        return this.makeStatusList(dataPage);
    }
    ;
    async postStatus(authToken, newStatus) {
        // Pause so we can see the logging out message. Remove when connected to the server
        let auth = await this.authDAO.checkAuthToken(authToken);
        if (!auth) {
            throw new Error("Invalid auth token");
        }
        let newStatusObj = tweeter_shared_1.Status.fromJson(newStatus);
        if (!newStatusObj) {
            throw new Error("Did fromat a status correctly ");
        }
        let success = await this.statusDAO.postStatus(newStatusObj);
        if (!success) {
            throw new Error("Invalid status");
        }
        let sqsClient = new client_sqs_1.SQSClient();
        try {
            await sqsClient.send(new client_sqs_1.SendMessageCommand({
                DelaySeconds: 1,
                MessageBody: newStatusObj.toJson(),
                QueueUrl: "https://sqs.us-west-2.amazonaws.com/767398142149/StatusDistributionQueue",
            }));
        }
        catch (e) {
            console.error("[Server Error] Error adding post to Statuses Queue: " + e);
        }
    }
    ;
    async addToFeeds(status) {
        console.log("Adding to feeds: " + JSON.stringify(status.toJson()));
        let newStatus = tweeter_shared_1.Status.fromJson(status.toJson());
        if (!newStatus) {
            throw new Error("[Bad Request] Status is missing data. Cannot add to batch queue.");
        }
        await this.feedDAO.sendAToUserFeeds(newStatus);
    }
    async batchUploadToFeeds(command) {
        await this.feedDAO.batchUpload(command);
    }
}
exports.StatusService = StatusService;
