import { User } from "tweeter-shared";

export abstract class UserDAO {

    abstract createUser(user: User): Promise<boolean>;
    abstract getUser(alias: string): Promise<User | null>;
    abstract loginUser(alias: string, password: string): Promise<User | null>;

}