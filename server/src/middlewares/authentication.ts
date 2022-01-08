import { Response, Request, NextFunction } from "express";
import * as jwt from 'jsonwebtoken';
import { decode } from "punycode";
import { Payload, requestCustom } from "../interfaces/interfaces";

export function isValidToken(req: requestCustom, res: Response, next: NextFunction): any {
  let token = req.body.token || req.query.token || req.headers["access-token"];

  if (!token) {
    return res.status(403).header('Access-Token', '').json({ message: "access denied" });
  }

  try {
    let decode = jwt.verify(token, <string>process.env.TOKEN_KEY) as Payload ; 
    
    req.idUser = decode.id_user
  } catch (e) {
    return res.status(401).json({ message: "error in authentication" });
  }

  let id_user: string = req.idUser;
  let newToken: string = jwt.sign({ id_user }, <string>process.env.TOKEN_KEY, {
    expiresIn: '2h'
  })

  res.header('Access-Token', newToken);

  next();
}
