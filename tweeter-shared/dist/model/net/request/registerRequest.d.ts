import { tweeterRequest } from "./tweeterRequest";
export interface RegisterRequest extends tweeterRequest {
    firstName: string;
    lastName: string;
    alias: string;
    password: string;
    imageString: string;
    imageFileExtension: string;
}
