import { UserDTO } from '../../dto/userDto';
import { tweeterRequest } from './tweeterRequest';

export interface PagedUserItemRequest extends tweeterRequest
{
   readonly alias:string
   readonly pageSize: number;
   readonly lastItem: UserDTO | null;

}