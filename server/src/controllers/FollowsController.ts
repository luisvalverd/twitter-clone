import { Response } from 'express';
import { getRepository } from 'typeorm';
import { Followers } from '../entity/Followers';
import { User } from '../entity/User';
import { Follow, requestCustom } from '../interfaces/interfaces';
import { v4 as uuid } from 'uuid';

export class FollowersController {
  followRepository = getRepository(Followers);
  userRepository = getRepository(User);

  async isValidId(id: string): Promise<boolean> {
    let follower = await this.followRepository.findOne({ id_follower: id})
    if (follower) {
      return true;
    }
    return false;
  }

  async generateIdFollower(): Promise<string> {
    let result: string = uuid();

    let verifyFollower = await this.isValidId(result);

    if (verifyFollower === true) {
      this.generateIdFollower();
    }

    return result;
  } 

  async isValidUser(nickname: string): Promise<boolean> {
    let user = await new FollowersController().userRepository.findOne({ nickname });
    if (user) {
      return true;
    }
    return false;
  }

  async isFollowUser(nickname: string): Promise<boolean> {
    let follow = await new FollowersController().followRepository
      .findOne({
        relations:["followUser"],
        where: {
          followUser: {
            nickname: nickname,
          }
        }
      });
    
    if (follow) {
      return true;
    }

    return false;
  }

  async isNotMeUser(nickname: string, id: string): Promise<boolean> {
    let user = await new FollowersController().userRepository
      .findOne({ nickname });
    
    let myUser = await new FollowersController().userRepository
      .findOne({ id_user: id });

    if (user?.id_user === myUser?.id_user) {
      return true;
    }
    return false;
  }

  async getMyFollowers(req: requestCustom, res: Response): Promise<Response> {
    let myFollowers = await new FollowersController().followRepository
      .find({
        relations: ["followUser", "user"],
        where: {
          followUser: {
            id_user: req.idUser,
          }
        }
      });
    
    if (myFollowers.length === 0) {
      return res.json({message: "you donnot have any follower"})
    }

    return res.json(myFollowers);
  }

  async getMyFollowing(req: requestCustom, res: Response): Promise<Response> {
    let myFollowing = await new FollowersController().followRepository
      .find({
        relations: ["user", "followUser"],
        where: {
          user: {
            id_user: req.idUser,
          }
        }
      });
    
    if (myFollowing.length === 0) {
      return res.json({ message: "you donnot following any person" });
    }

    return res.json(myFollowing);
  }

  async followUser(req: requestCustom, res: Response): Promise<Response> {
    let data = req.body;

    let follower = new Followers();

    let isValidUser = new FollowersController().isValidUser(data.nicknameUserFollow);
    if (!isValidUser) {
      return res.status(400).json({ message: "user is not exist" }); 
    }

    let isFollowUser = await new FollowersController().isFollowUser(data.nicknameUserFollow);
    if (isFollowUser) {
      return res.status(400).json({ message: "user already follow" });
    }

    let isNotMeUser = await new FollowersController().isNotMeUser(data.nicknameUserFollow, <string>req.idUser);
    if (isNotMeUser) {
      return res.status(400).json({message: "error you cannot follow yourself"})
    }

    follower.id_follower = await new FollowersController().generateIdFollower();
    follower.followUser = <User> await new FollowersController().userRepository.findOne({ nickname: data.nicknameUserFollow });
    follower.user = <User>await new FollowersController().userRepository.findOne({ id_user: req.idUser });
    
    try {
      new FollowersController().followRepository.save(follower);
    } catch (error) {
      return res.status(400).json({ message: "error in follow user" });
    }

    return res.json({ message: "follow user successfuly", follower });
  }

  // unfollow user
  async unFollowUser(req: requestCustom, res: Response): Promise<Response> {
    let data = req.body;

    let FollowUser = <User> await new FollowersController().userRepository.findOne({ nickname: data.nicknameUserFollow });
    let follow = <Follow>await new FollowersController().followRepository
      .findOne({
        relations: ["followUser"],
        where: {
          followUser: FollowUser, 
        }
      });

    try {
      await new FollowersController().followRepository.delete({
        id_follower: follow.id_follower
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "error" });
    } 

    return res.json({ message: "unfollow user", follow});

  }
}