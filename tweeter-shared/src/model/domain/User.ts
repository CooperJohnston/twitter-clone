import { UserDTO } from "../dto/userDto";

export class User {
  private _firstName: string;
  private _lastName: string;
  private _alias: string;
  private _imageUrl: string;
  private _password:  string | null 

  public constructor(
    firstName: string,
    lastName: string,
    alias: string,
    imageUrl: string,
    password: string | null = null
  ) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._alias = alias;
    this._imageUrl = imageUrl;
    this._password = password;
  
  }

  public get firstName(): string {
    return this._firstName;
  }

  public set firstName(value: string) {
    this._firstName = value;
  }

  public get lastName(): string {
    return this._lastName;
  }

  public set lastName(value: string) {
    this._lastName = value;
  }

  public get name() {
    return `${this.firstName} ${this.lastName}`;
  }

  public get alias(): string {
    return this._alias;
  }

  public set alias(value: string) {
    this._alias = value;
  }

  public get imageUrl(): string {
    return this._imageUrl;
  }

  public set imageUrl(value: string) {
    this._imageUrl = value;
  }
  public set password(value: string |null) {
    this._password = value;
  }
  public get password(): string | null {
    return this._password;
  }


  public equals(other: User): boolean {
    return this._alias === other._alias;
  }

  public static fromJson(json: string | null | undefined): User | null {
    if (!!json) {
      const jsonObject: {
        _firstName: string;
        _lastName: string;
        _alias: string;
        _imageUrl: string;
        _password: string | null;
      } = JSON.parse(json);
      return new User(
        jsonObject._firstName,
        jsonObject._lastName,
        jsonObject._alias,
        jsonObject._imageUrl,
        jsonObject._password
        
      );
    } else {
      return null;
    }
  }

  public toJson(): string {
    return JSON.stringify(this);
  }

  public get dto() : UserDTO {
    return {
      firstName : this.firstName, 
       lastName: this.lastName,
        alias: this.alias, 
        imageUrl: this.imageUrl
        , password: this.password}
   }
  


  public static fromDto (dto: UserDTO | null) : User | null {
    return dto == null ? null : new User(dto.firstName, dto.lastName, dto.alias, dto.imageUrl, dto.password);
  }
}
