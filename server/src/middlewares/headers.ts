import { Response, Request, NextFunction } from "express";

export function headersExpose(req: Request, res: Response, next: NextFunction) {
  res.header('Access-Control-Expose-Headers', 'Access-Token');
  next()
}


