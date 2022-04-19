import { getRepository, Repository } from "typeorm";
import { Post } from "../entity/Post";
import { requestCustom } from "../interfaces/interfaces";
import { Response } from "express";
import { Followers } from "../entity/Followers";
import { User } from "../entity/User";
import { Likes } from "../entity/Likes";

export class GetController {
  postRepository = getRepository(Post);
  followerRepository = getRepository(Followers);
  userRepository = getRepository(User);
  likeRepository = getRepository(Likes);

  async getAllMyPost(req: requestCustom, res: Response): Promise<Response> {
    let getMyPosts = await new GetController().postRepository.find({
      relations: ["user", "likes_post"],
      where: {
        user: {
          id_user: req.idUser,
        },
      },
    });

    let user = await new GetController().userRepository.findOne({
      relations: ["likes"],
      where: {
        id_user: req.idUser,
      },
    });

    if (getMyPosts.length === 0) {
      return res.json({ message: "you donnot have any pubication", user });
    }

    return res.json({ user, MyPosts: getMyPosts });
  }

  async getPostFollowingUser(
    req: requestCustom,
    res: Response
  ): Promise<Response> {
    let myFollowing = await new GetController().followerRepository.find({
      relations: ["user", "followUser"],
      where: {
        user: {
          id_user: req.idUser,
        },
      },
    });

    if (myFollowing.length === 0) {
      return res.json({ message: "you donnot have any following" });
    }

    let post: any = [];
    let postFollowing;

    try {
      for (let i = 0; i < myFollowing.length; i++) {
        postFollowing = await new GetController().postRepository.find({
          relations: ["user", "likes_post"],
          where: {
            user: {
              id_user: myFollowing[i].followUser.id_user,
            },
            private: false,
          },
        });
        // save post in array
        postFollowing.map((callback) => {
          post.push(callback);
        });
      }

      if (post.length === 0) {
        return res.json({ message: "dont any post in this moment" });
      }
    } catch (error) {
      return res.status(400).json({ message: "error in request" });
    }

    //console.log(post.sort((a: any, b: any) => a.created > b.created));

    return res.json(post);
  }

  async getIdLikes(req: requestCustom, res: Response) {
    let likes: any;

    try {
      likes = await new GetController().likeRepository
        .createQueryBuilder("likes")
        .leftJoinAndSelect("like.post", "post")
        .leftJoinAndSelect("like.like_user", "user")
        .where("user.id_user = :id_user", { id_user: req.idUser })
        .getMany();

      likes = likes.map((like: any) => {
        return like.post.id_post;
      });
    } catch (error) {
      return res.status(204).json("Donnot find Likes");
    }

    return res.json(likes);
  }
}
