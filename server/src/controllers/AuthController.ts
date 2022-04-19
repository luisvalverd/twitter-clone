import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { requestCustom, user } from "../interfaces/interfaces";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { v4 as uuid } from "uuid";
import { Likes } from "../entity/Likes";

dotenv.config();

export class AuthController {
  userRepository = getRepository(User);
  likeRepository = getRepository(Likes);

  async isValidId(id: string): Promise<boolean> {
    let user = await this.userRepository.find({ id_user: id });
    if (user) {
      return true;
    }

    return false;
  }

  async generateID(): Promise<string> {
    let result: string = uuid();

    let verifyUser = await this.isValidId(result);

    if (verifyUser === true) {
      this.generateID();
    }
    return result;
  }

  async loginUser(req: Request, res: Response): Promise<Response> {
    let data: user = req.body;
    let likes: any;

    if (data.password === undefined) {
      return res.status(403).json({ message: "error in password" });
    }

    let findUser: User | any;

    let token: any;

    try {
      findUser = await new AuthController().userRepository
        .createQueryBuilder("user")
        .addSelect("user.password")
        .where("user.nickname = :nickname", { nickname: data.nickname })
        .getOne();

      let isValidPassoword = await bcrypt.compare(
        data.password,
        findUser.password
      );

      if (!isValidPassoword || !findUser) {
        return res.status(403).json({ message: "password is not valid" });
      }

      token = jwt.sign(
        { id_user: findUser.id_user },
        <string>process.env.TOKEN_KEY,
        {
          expiresIn: "120s",
        }
      );

      likes = await new AuthController().likeRepository
        .createQueryBuilder("like")
        .leftJoinAndSelect("like.user_like", "user")
        .leftJoinAndSelect("like.post", "post")
        .where("user.nickname = :nickname", {
          nickname: data.nickname,
        })
        .getMany();
    } catch (e) {
      console.log(e);
      return res.status(403).json({ message: "authentication error" });
    }

    let likes_id = likes.map((like: any) => {
      return like.post.id_post;
    });

    findUser.likes = likes_id;

    return res.header("Access-Token", token).json(findUser);
  }

  async registerUser(req: Request, res: Response): Promise<Response> {
    let data: user = req.body;
    let user = new User();
    let id = await new AuthController().generateID();
    let hash = await bcrypt.hash(data.password, 10);

    if (data.confirmPassword !== data.password) {
      return res.status(409).json("passwords not match...");
    }

    user.id_user = <string>id;
    user.nickname = <string>data.nickname;
    user.password = <string>hash;
    user.description = <string>data.description || "";
    user.location = <string>data.location;

    // this validate if nickname already exist in databse
    let isAlreadyUser = await new AuthController().userRepository.find({
      nickname: user.nickname,
    });

    if (isAlreadyUser.length !== 0) {
      return res.status(403).json({ message: "user already exits" });
    }

    let token = await jwt.sign({ id_user: id }, <string>process.env.TOKEN_KEY, {
      expiresIn: "4h",
    });

    try {
      new AuthController().userRepository.save(user);
    } catch (e) {
      console.log(e);
      return res.status(403).json({ message: "error save user" });
    }

    return res
      .header("Access-Token", token)
      .json({ message: "user seve successfuly", user });
  }
}
