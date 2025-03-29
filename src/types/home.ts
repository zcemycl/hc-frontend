import { UserRoleEnum } from "./users";

export interface IRequestDemoForm {
  name: string;
  email: string;
  message: string;
}

export interface IData {
  success?: boolean;
  message?: string;
  id?: number;
  username?: string;
  role?: UserRoleEnum;
}
