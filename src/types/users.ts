export enum UserRoleEnum {
  USER = "User",
  ADMIN = "Admin",
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  sub: string;
  enabled: boolean;
  role: UserRoleEnum;
  created_date: string;
  modified_date: string;
  created_user: string;
  modified_user: string;
  ae_annotations_count: number;
  activities_count: number;
}
