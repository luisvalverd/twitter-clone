import { Response, Request } from "express";
import { getRepository } from "typeorm";
import { Post } from "../entity/Post";
import { User } from "../entity/User";
import { post, requestCustom } from "../interfaces/interfaces";

export class PostController {

  postRepository = getRepository(Post);
  userRepository = getRepository(User);

  async isValidId(id: string): Promise<boolean> {
    let post = await this.postRepository.find({ id_post: id });
    if (post) {
      return true;
    }

    return false;
  }

  // in this function return a id user 
  async generateIdPost(): Promise<string> {
    let result: string = '';
    let characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 50; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    let verifyUser = await this.isValidId(result);

    if (verifyUser === true) {
      this.generateIdPost();
    }
    return result;
  }

  async createPost(req: requestCustom, res: Response): Promise<Response> {
    let data: post = req.body;
    let newPost = new Post();

    newPost.id_post = await new PostController().generateIdPost(); 
    newPost.description = data.description;
    newPost.photo = data.photo || '';

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
}



