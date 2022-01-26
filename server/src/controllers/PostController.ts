import { Response, Request } from "express";
import { getRepository } from "typeorm";
import { Post } from "../entity/Post";
import { User } from "../entity/User";
import { post, requestCustom } from "../interfaces/interfaces";
import { v4 as uuid } from "uuid";

export class PostController {

  postRepository = getRepository(Post);
  userRepository = getRepository(User);

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

  async createPost(req: requestCustom, res: Response): Promise<Response> {
    let data: post = req.body;
    let newPost = new Post();
    let date = new Date();

    newPost.id_post = await new PostController().generateIdPost(); 
    newPost.description = data.description;
    newPost.photo = data.photo || '';
    newPost.private = data.private || false;
    newPost.created = <string>date.toLocaleDateString();

    let user = await new PostController().userRepository.findOne({id_user: req.idUser})
    newPost.user = <User>user;

    try {
      new PostController().postRepository.save(newPost); 
    } catch (e) {
      console.log(e);
      return res.json({message: "post error save"})
    }
    
    return res.json({ message: "post save successfuly" }); 
  }
  async updateAvatar(req: requestCustom, res: Response): Promise<Response> {
    let img = req.file?.path;

    if (!img) {
      res.status(400).json({ message: "donnot any image" });
    }
    
    return res.json(img);
  }
}



