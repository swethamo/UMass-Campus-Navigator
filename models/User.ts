export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  savedBuildings: string[];
}

export interface UserInfo {
  sub: string;
  name: string;
  username: string;
  email: string;
}

export interface UserUpdate {
  name?: string;
  username?: string;
  email?: string;
  savedBuildings?: string[];
}
