import { UserRoleEnum } from "./users";

export interface IAddUserInfo {
  username: string;
  email: string;
  role: UserRoleEnum;
}
