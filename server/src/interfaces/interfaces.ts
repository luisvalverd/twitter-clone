import { User } from "../entity/User";
import { Request } from "express";
import { Post } from "../entity/Post";

export interface user {
  id_user: string;
  avatar?: string;
  nickname: string;
  password: string;
  description?: string;
  location?: string;
  confirmPassword?: string;
}

export interface post {
  id_post: string;
  description: string;
  photo?: string;
  user: User;
  private?: boolean;
}

export interface Payload {
  id_user: string;
  iat: number;
  exp: number;
}

export interface requestCustom extends Request {
  idUser?: string;
  files: any;
}

export interface Provider {
  fieldname: string;
  originalname: string;
  encoding: string;
  minetype: string;
  destination: string;
  filename: string;
  path: string;
  zise: number;
}

export interface Follow {
  id_follower: string;
  user?: User;
  FollowUser?: User;
}

export interface likes {
  id_like: string;
  user: User;
  post: Post;
}
