import { UserDTO } from '../../dto/userDto';
import { tweeterRequest } from './tweeterRequest';
export interface UserItemRequest extends tweeterRequest {
    readonly userAlias: string;
    readonly userInfo: UserDTO;
}
