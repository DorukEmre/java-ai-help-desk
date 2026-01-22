export type Role = "STANDARD_USER" | "SERVICE_DESK_USER" | "ADMIN";

export interface User {
  id: string;
  username: string;
  fullname: string;
  role: Role;
}

export interface LoginResponse extends User {
  accessToken: string;
}
