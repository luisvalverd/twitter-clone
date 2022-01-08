import { User } from "../entity/User";
import { Request } from "express";

export interface user {
  id_user: string,
  avatar?: string,
  nickname: string,
  password: string,
  description?: string,
  location?: string,
}

export interface post {
  id_post: string,
  description: string,
  photo?: string,
  user: User;
}

export interface Payload {
  id_user: string;
  iat: number,
  exp: number,
}

export interface requestCustom extends Request {
  idUser?: string;
}