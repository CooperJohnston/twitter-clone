import { AuthToken } from "../model/domain/AuthToken";
import { Status } from "../model/domain/Status";
import { User } from "../model/domain/User";
export declare class FakeData {
    private readonly _authToken;
    get authToken(): AuthToken;
    private readonly allUsers;
    get fakeUsers(): User[];
    private allStatuses;
    get fakeStatuses(): Status[];
    private fakeUsersUsedToGenerateStatuses;
    private static _instance;
    /**
     * Returns the singleton instance.
     */
    static get instance(): FakeData;
    private constructor();
    /**
     * Generates fake statuses for the fake users.
     */
    private generateFakeStatuses;
    /**
     * Returns the first fake user, or null if there are no fake users.
     */
    get firstUser(): User | null;
    /**
     * Returns the second fake user, or null if there are not at least two fake users.
     */
    get secondUser(): User | null;
    /**
     * Finds the user with the specified alias.
     *
     * @param alias the alias of the user to be returned.
     * @returns the user or null if no user is found with the specified alias.
     */
    findUserByAlias(alias: string): User | null;
    /**
     * Returns a random boolean for whether or not a user follows another user.
     */
    isFollower(): boolean;
    /**
     * Returns a page of users (followers or followees).
     *
     * @param lastUser the last user returned in the previous page of results.
     * @param limit maximum number of users to return (i.e., page size).
     * @param omit if not null, specifies the alias of a user that should not be returned.
     * @returns a tuple containing a page of users and a "hasMorePages" flag.
     */
    getPageOfUsers(lastUser: User | null, limit: number, omit: string | null): [User[], boolean];
    /**
     * Returns a page of statuses (story or feed items).
     *
     * @param lastStatus - the last status returned in the previous page of results.
     * @param limit - maximum number of statuses to return (i.e., page size).
     * @returns a tuple containing a page of statuses and a "hasMorePages" flag.
     */
    getPageOfStatuses(lastStatus: Status | null, limit: number): [Status[], boolean];
    /**
     * Returns a followers count for the user, as a random number between 1 and 10.
     */
    getFollowerCount(userAlias: string): number | PromiseLike<number>;
    /**
     * Returns a followees count for the user, as a random number between 1 and 10.
     */
    getFolloweeCount(userAlias: string): number | PromiseLike<number>;
}
