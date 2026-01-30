export type Role = "STANDARD_USER" | "AGENT" | "ADMIN";

export interface User {
  id: string;
  username: string;
  fullname: string;
  role: Role;
}

export interface LoginResponse extends User {
  accessToken: string;
}
