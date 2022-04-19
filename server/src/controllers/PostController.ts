import { Response, Request, Express } from "express";
import { getRepository } from "typeorm";
import { Post } from "../entity/Post";
import { User } from "../entity/User";
import { post, requestCustom, likes, Provider } from "../interfaces/interfaces";
import { v4 as uuid } from "uuid";
import { Likes } from "../entity/Likes";
import { Followers } from "../entity/Followers";

export class PostController {
  postRepository = getRepository(Post);
  userRepository = getRepository(User);
  likeRepository = getRepository(Likes);
  followRepository = getRepository(Followers);

  async isValidId(id: string): Promise<boolean> {
    let post = await this.postRepository.findOne({ id_post: id });
    if (post) {
      return true;
    }

    return false;
  }

  // in this function return a id user
  async generateIdPost(): Promise<string> {
    let result: string = uuid();

    let verifyPost = await this.isValidId(result);

    if (verifyPost === true) {
      this.generateIdPost();
    }
    return result;
  }

  async getImgUser(id: string): Promise<string> {
    let user = await this.userRepository.findOne({ id_user: id });

    if (!user) {
      return "";
    }

    let pathAvatar = user?.avatar;
    return pathAvatar;
  }

  async getBackgroundUser(id: string): Promise<string> {
    let user = await this.userRepository.findOne({ id_user: id });

    if (!user) {
      return "";
    }

    let pathBackground = user?.backgroundImg;
    return pathBackground;
  }

  async createPost(req: requestCustom, res: Response): Promise<Response> {
    let data: post = req.body;
    let newPost = new Post();
    let date = new Date();
    let filePath = req.file?.path;

    if (filePath) {
      data.photo = filePath;
    } else {
      data.photo = "";
    }

    if (data.private) {
      data.private = JSON.parse(<any>data.private);
    }

    if (data.description === "") {
      return res.status(400).json({ message: "description is enpty" });
    }

    newPost.id_post = await new PostController().generateIdPost();
    newPost.description = data.description;
    newPost.photo = data.photo || "";
    newPost.private = data.private || false;
    newPost.created = <string>date.toLocaleDateString();
    newPost.time = <string>date.toLocaleTimeString();

    let user = await new PostController().userRepository.findOne({
      id_user: req.idUser,
    });
    newPost.user = <User>user;

    try {
      new PostController().postRepository.save(newPost);
    } catch (e) {
      console.log(e);
      return res.json({ message: "post error save" });
    }

    return res.json({ message: "post save successfuly" });
  }

  /**
   * * acutializacion de datos de avatar de usuario
   * @param req
   * @param res
   * @returns
   */
  async updateAvatar(req: requestCustom, res: Response): Promise<Response> {
    let img = req.file?.path;

    if (!img) {
      return res.status(400).json({ message: "donnot any image" });
    }

    try {
      let user = await new PostController().userRepository.update(
        { id_user: req.idUser },
        { avatar: img }
      );
    } catch (err) {
      return res.status(400).json({ message: "Error update image avatar" });
    }

    return res.json({ message: "update image successfuly" });
  }

  /**
   * * update de user data
   * @param req
   * @param res
   * @returns json with info of user
   */
  async updateDataUser(req: requestCustom, res: Response): Promise<Response> {
    let avatar = req.files.avatar[0];
    let background = req.files.background[0];
    let { description, location } = req.body;

    if (!avatar) {
      avatar = await new PostController().getImgUser(<string>req.idUser);
    }

    if (!background) {
      background = await new PostController().getBackgroundUser(
        <string>req.idUser
      );
    }
    let user;

    try {
      user = await new PostController().userRepository.update(
        { id_user: req.idUser },
        {
          avatar: <string>avatar.path,
          backgroundImg: <string>background.path,
          description,
          location,
        }
      );
    } catch (err) {
      return res.status(400).json({
        message: "Error to update data",
      });
    }

    return res.json(user);
  }

  // revisar si el metodo se utiliza
  async findUserByUsername(
    req: requestCustom,
    res: Response
  ): Promise<Response> {
    let { username } = req.body;
    let user;

    if (!username || username === "") {
      return res.json([]);
    }

    try {
      user = await new PostController().userRepository
        .createQueryBuilder("user")
        .where("user.nickname like :username", { username: `%${username}%` })
        .limit(10)
        .getMany();

      return res.json(user);
    } catch (error) {
      return res.status(400).json("error in find user");
    }
  }

  /**
   * find a profile of user expesific
   * * use a binary search to de find publications what the user is liked
   * * get my likes when I search a user o my user
   * TODO: create a method validate if in public I like
   * TODO: validate if post of other user is private and dont show;
   * @param req
   * @param res
   * @returns
   */
  async findProfileUser(req: requestCustom, res: Response): Promise<Response> {
    let { username } = req.body;
    let user;
    let likes;
    let post;
    let follow;

    if (!username || username === "") {
      return res.json({ message: "username is empty" });
    }

    try {
      user = await new PostController().userRepository
        .createQueryBuilder("user")
        .where("user.nickname = :username", { username })
        .getOne();

      post = await new PostController().postRepository.find({
        relations: ["user", "likes_post"],
        where: {
          user: {
            nickname: username,
          },
        },
      });

      likes = await new PostController().likeRepository.find({
        relations: ["user_like", "post"],
        where: {
          user_like: {
            nickname: username,
          },
        },
      });

      follow = await new PostController().followRepository.findOne({
        relations: ["user", "followUser"],
        where: {
          user: {
            id_user: <string>req.idUser,
          },
          followUser: {
            id_user: <string>user?.id_user,
          },
        },
      });
    } catch (error) {
      return res.status(400).json("Error in find user");
    }

    //get if this is my profile
    let isMyProfile = false;
    if (user?.id_user === req.idUser) {
      isMyProfile = true;
    }

    let isFollow = false;
    if (follow) {
      isFollow = true;
    }

    return res.json({ user, posts: post, isMyProfile, isFollow });
  }

  /**
   * * verify if id is use
   * @param id
   * @returns boolean if already use the id
   */
  async isValidIdLike(id: string): Promise<boolean> {
    let likeId = await new PostController().likeRepository.findOne({
      id_like: id,
    });

    if (likeId) {
      return true;
    }

    return false;
  }

  /**
   * * genera a id to use the in Like
   * @returns the string id
   */
  async generateIdLike(): Promise<string> {
    let idLike: string = uuid();

    let isValidId = await new PostController().isValidIdLike(idLike);
    if (isValidId) {
      new PostController().generateIdLike();
    }

    return idLike;
  }

  /**
   * * Verify if User Like post
   * @param idUser get the id user and find if user is liked post
   * @param idPost get the like in user and post already exists
   * @returns boolean
   */
  async isLiked(idUser: string, idPost: string): Promise<boolean> {
    let likePost = await new PostController().likeRepository.findOne({
      relations: ["user_like", "post"],
      where: {
        user_like: {
          id_user: idUser,
        },
        post: {
          id_post: idPost,
        },
      },
    });
    if (likePost) {
      return true;
    }
    return false;
  }

  /**
   * Like Publication
   * * in this method the user will can put the like in post
   * @param req
   * @param res
   * @returns res.json or in case error resturn a res.status(400).json(Error);
   */

  async likePublic(req: requestCustom, res: Response): Promise<Response> {
    let { id_post } = req.body;

    let newLike = new Likes();

    newLike.id_like = await new PostController().generateIdLike();

    // * if is liked post, remove that like

    let isLikedPost = await new PostController().isLiked(
      <string>req.idUser,
      <string>id_post
    );

    if (isLikedPost) {
      await new PostController().likeRepository
        .createQueryBuilder()
        .relation("user_like")
        .delete()
        .from(Likes)
        .where("user_like.id_user = :id", { id: <string>req.idUser })
        .execute();

      let likes = await new PostController().likeRepository.find({
        relations: ["post"],
        where: {
          post: {
            id_post,
          },
        },
      });

      return res.json({ message: "like Remove", likes: likes.length });
    }

    try {
      // instance user what like the post
      let user = await new PostController().userRepository.findOne({
        id_user: <string>req.idUser,
      });
      newLike.user_like = <User>user;

      // instance the post been liked
      let post = await new PostController().postRepository.findOne({
        id_post: id_post,
      });
      newLike.post = <Post>post;
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Error in find post or find user" });
    }

    if (!newLike.user_like || !newLike.post) {
      console.log(newLike.post);
      return res.status(400).json({ message: "Donnot find user or post" });
    }

    try {
      await new PostController().likeRepository.save(newLike);
    } catch (err) {
      return res.status(400).json({ message: "Error in like post" });
    }

    let likes = await new PostController().likeRepository.find({
      relations: ["post"],
      where: {
        post: {
          id_post,
        },
      },
    });

    return res.json({ message: "liked post!", likes: likes.length });
  }
}
