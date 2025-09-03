import { Status, } from "tweeter-shared";
import { StatusesDAO } from "../dao/interfaces/StatusDAO";
import { DAOFactory } from "../dao/interfaces/DAOFactory";
import { FeedsDAO } from "../dao/interfaces/FeedDAO";
import { AuthTokenDAO } from "../dao/interfaces/AuthTokenDAO";
import { DataPage } from "../dao/interfaces/DataPage";
import {SendMessageCommand, SQSClient} from "@aws-sdk/client-sqs";

export class StatusService {
  private statusDAO: StatusesDAO;
  private authDAO: AuthTokenDAO;
  private feedDAO: FeedsDAO;

  constructor(daoFactory: DAOFactory) {
    this.statusDAO = daoFactory.getStatusDAO();
    this.authDAO = daoFactory.getAuthTokenDAO();
    this.feedDAO = daoFactory.getFeedDAO();
    
  }
    public async loadMoreFeedItems (
          authToken: string,
          userAlias: string,
          pageSize: number,
          lastItem: string | null
        ): Promise<[string[], boolean]>{
          // TODO: Replace with the result of calling server

          let auth = await this.authDAO.checkAuthToken(authToken);
          if (!auth) {
            throw new Error("Invalid auth token");
          }
        const dataPage = await this.feedDAO.loadMoreFeedItems(userAlias, pageSize, Status.fromJson(lastItem)?.timestamp ?? undefined);
       return this.makeStatusList(dataPage);
        };
    
  private makeStatusList(page: DataPage<Status>) : [string[], boolean] {
    const statusItems = page.values;
        const hasMore = page.hasMore;
        const statusIds = statusItems.map((status) => status.toJson());
    return [statusIds, hasMore];
  }

    public async loadMoreStoryItems (
          authToken: string,
          userAlias: string,
          pageSize: number,
          lastItem: string | null
        ): Promise<[string[], boolean]>{
          let auth = await this.authDAO.checkAuthToken(authToken);
          if (!auth) {
            throw new Error("Invalid auth token");
          }

        let lastTimeStamp: number | undefined = undefined;
        if (lastItem !== null){
          let lastStatus: Status | null = Status.fromJson(lastItem);
          if (lastStatus?.timestamp) {
            lastTimeStamp = lastStatus.timestamp;
          }
        }
        const dataPage = await this.statusDAO.getStatuses(userAlias, pageSize,lastTimeStamp);
        return this.makeStatusList(dataPage);
        };

    public async postStatus (
          authToken: string,
          newStatus: string
        ): Promise<void> {
          // Pause so we can see the logging out message. Remove when connected to the server
          let auth = await this.authDAO.checkAuthToken(authToken);
          if (!auth) {
            throw new Error("Invalid auth token");
          }
          let newStatusObj = Status.fromJson(newStatus);
          if (!newStatusObj){
            throw new Error("Did fromat a status correctly ")
          }
          let success = await this.statusDAO.postStatus(newStatusObj!);
          if (!success) {
            throw new Error("Invalid status");
          }
      
          let sqsClient = new SQSClient();
          try {
            await sqsClient.send(new SendMessageCommand({
              DelaySeconds: 1,
              MessageBody: newStatusObj.toJson(),
              QueueUrl: "https://sqs.us-west-2.amazonaws.com/767398142149/StatusDistributionQueue",
            }));
          } catch (e) {
            console.error("[Server Error] Error adding post to Statuses Queue: " + e);
          }
      
        };

    public async addToFeeds(
          status: Status
        ): Promise<void> {
          console.log("Adding to feeds: " + JSON.stringify(status.toJson()));
          let newStatus = Status.fromJson(status.toJson());
          if (!newStatus) {
            throw new Error("[Bad Request] Status is missing data. Cannot add to batch queue.")
          }
          await this.feedDAO.sendAToUserFeeds(newStatus);
        }
      
        public async batchUploadToFeeds(
          command: any
        ): Promise<void> {
          await this.feedDAO.batchUpload(command);
        }
}