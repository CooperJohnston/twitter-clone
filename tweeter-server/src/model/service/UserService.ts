
import { AuthToken, User, UserDTO } from "tweeter-shared";
import { UserDAO } from "../dao/interfaces/UserDAO";
import { AuthTokenDAO } from "../dao/interfaces/AuthTokenDAO";
import { ImageDAO } from "../dao/interfaces/ImageDAO";
import { DAOFactory } from "../dao/interfaces/DAOFactory";

export class UserService {
  private userDAO: UserDAO;
  private authDAO: AuthTokenDAO;
  private imageDAO: ImageDAO;

  constructor(daoFactory: DAOFactory) {
    this.userDAO = daoFactory.getUserDAO();
    this.authDAO = daoFactory.getAuthTokenDAO();
    this.imageDAO = daoFactory.getImageDAO();
  }

  public async register (
      firstName: string,
      lastName: string,
      alias: string,
      password: string,
      userImageString: string,
      imageFileExtension: string
    ): Promise<[UserDTO, string]>  {
      // Not neded now, but will be needed when you make the request to the server in milestone 3
      let userImage = await this.imageDAO.putImage(alias+"_pfp", userImageString)
      // TODO: Replace with the result of calling the server
      let user = new User(firstName, lastName, alias, userImage, password)
      let result = await this.userDAO.createUser(user);
  
      if (result === false) {
        throw new Error("Invalid registration");
      }
  
      const userData = user.dto;
      let authToken =await this.authDAO.createAuthToken(AuthToken.Generate(), alias);
  
      return [userData, authToken.token];
    };

  public async login(
      alias: string,
      password: string
    ): Promise<[UserDTO, string]>{
      // TODO: Replace with the result of calling the server
      let user = await this.userDAO.loginUser(alias, password);
  
      if (user === null) {
        throw new Error("Invalid alias or password");
      }
      let authToken =await this.authDAO.createAuthToken(AuthToken.Generate(), alias);
      const userData = user.dto
  
      return [userData, authToken.token];
    };

    public async logout (authToken: string): Promise<void>{
      // Pause so we can see the logging out message. Delete when the call to the server is implemented.
      await this.authDAO.deleteAuthToken(authToken);
    };

    public async getUser  (
        authToken: string,
        alias: string
      ): Promise<UserDTO | null>  {
        // TODO: Replace with the result of calling server
        let authorization = await this.authDAO.checkAuthToken(authToken);
        if (authorization === false) {
          throw new Error("Invalid authorization");
        }
        let user = await this.userDAO.getUser(alias);
        return user?.dto || null;
      };


    
}